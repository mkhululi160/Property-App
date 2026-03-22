import Property from '../models/Property.js';
import Review from '../models/Review.js';
import cloudinary from '../config/cloudinary.js';

export const getProperties = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const filter = {};

    if (req.query.keyword) {
      filter.$text = { $search: req.query.keyword };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.bedrooms) {
      filter.bedrooms = { $gte: Number(req.query.bedrooms) };
    }

    if (req.query.bathrooms) {
      filter.bathrooms = { $gte: Number(req.query.bathrooms) };
    }

    if (req.query.minArea || req.query.maxArea) {
      filter.area = {};
      if (req.query.minArea) filter.area.$gte = Number(req.query.minArea);
      if (req.query.maxArea) filter.area.$lte = Number(req.query.maxArea);
    }

    if (req.query.propertyType) {
      filter.propertyType = req.query.propertyType;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.city) {
      filter['address.city'] = new RegExp(req.query.city, 'i');
    }

    if (req.query.state) {
      filter['address.state'] = new RegExp(req.query.state, 'i');
    }

    if (req.query.amenities) {
      filter.amenities = { $all: req.query.amenities.split(',') };
    }

    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }

    let sort = {};
    switch (req.query.sort) {
      case 'price-asc': sort = { price: 1 }; break;
      case 'price-desc': sort = { price: -1 }; break;
      case 'newest': sort = { createdAt: -1 }; break;
      case 'oldest': sort = { createdAt: 1 }; break;
      case 'rating': sort = { averageRating: -1 }; break;
      case 'views': sort = { views: -1 }; break;
      default: sort = { createdAt: -1 };
    }

    const count = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .populate('user', 'name email phone profileImage')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      properties,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('user', 'name email phone profileImage');

    if (property) {
      property.views += 1;
      await property.save();

      const reviews = await Review.find({ property: property._id })
        .populate('user', 'name profileImage')
        .sort({ createdAt: -1 });

      const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length || 0;

      const nearbyProperties = await Property.find({
        _id: { $ne: property._id },
        'address.city': property.address?.city,
        price: { $gte: property.price * 0.7, $lte: property.price * 1.3 },
      }).limit(4).select('title price images bedrooms bathrooms area');

      res.json({
        ...property.toObject(),
        averageRating: avgRating,
        reviewCount: reviews.length,
        reviews,
        nearbyProperties,
      });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProperty = async (req, res) => {
  try {
    const {
      title, description, price, bedrooms, bathrooms, area,
      address, propertyType, status, features, amenities,
      yearBuilt, lotSize, hoaFees, taxAnnual,
    } = req.body;

    const property = new Property({
      user: req.user._id,
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      area,
      address: address ? JSON.parse(address) : {},
      propertyType,
      status: status || 'for-sale',
      features: features ? JSON.parse(features) : [],
      amenities: amenities ? amenities.split(',') : [],
      yearBuilt,
      lotSize,
      hoaFees,
      taxAnnual,
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const fields = ['title', 'description', 'price', 'bedrooms', 'bathrooms', 'area', 'propertyType', 'status', 'yearBuilt', 'lotSize', 'hoaFees', 'taxAnnual'];
    fields.forEach(field => {
      if (req.body[field]) property[field] = req.body[field];
    });

    if (req.body.address) property.address = JSON.parse(req.body.address);
    if (req.body.features) property.features = JSON.parse(req.body.features);
    if (req.body.amenities) property.amenities = req.body.amenities.split(',');

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopProperties = async (req, res) => {
  try {
    const properties = await Property.find({})
      .sort({ views: -1 })
      .limit(5);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertiesForMap = async (req, res) => {
  try {
    const { bounds, propertyType, minPrice, maxPrice } = req.query;
    const filter = {};

    if (bounds) {
      const boundsObj = JSON.parse(bounds);
      filter['address.coordinates'] = {
        $geoWithin: {
          $box: [
            [boundsObj.sw.lng, boundsObj.sw.lat],
            [boundsObj.ne.lng, boundsObj.ne.lat],
          ],
        },
      };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (propertyType) filter.propertyType = propertyType;

    const properties = await Property.find(filter)
      .select('title price images address propertyType bedrooms bathrooms');

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};