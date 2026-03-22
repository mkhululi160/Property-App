import mongoose from 'mongoose';

const propertySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  propertyType: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial'],
    required: true,
  },
  status: {
    type: String,
    enum: ['for-sale', 'for-rent', 'sold', 'rented', 'pending'],
    default: 'for-sale',
  },
  features: [{
    name: String,
    value: String,
  }],
  amenities: [String],
  images: [{
    url: String,
    publicId: String,
    isPrimary: Boolean,
  }],
  videos: [{
    url: String,
    title: String,
  }],
  virtualTour: String,
  documents: [{
    name: String,
    url: String,
    publicId: String,
  }],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  saves: {
    type: Number,
    default: 0,
  },
  yearBuilt: Number,
  lotSize: Number,
  hoaFees: Number,
  taxAnnual: Number,
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ 'address.city': 1, 'address.state': 1 });
propertySchema.index({ price: 1, bedrooms: 1 });

const Property = mongoose.model('Property', propertySchema);
export default Property;