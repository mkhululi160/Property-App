export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  const minLength = 6;
  const hasNumber = /\d/;
  const hasLetter = /[a-zA-Z]/;

  return {
    isValid: password.length >= minLength && hasNumber.test(password) && hasLetter.test(password),
    errors: {
      minLength: password.length < minLength,
      hasNumber: !hasNumber.test(password),
      hasLetter: !hasLetter.test(password),
    },
  };
};

export const validatePropertyForm = (formData) => {
  const errors = {};

  if (!formData.title) errors.title = 'Title is required';
  if (!formData.description) errors.description = 'Description is required';
  if (!formData.price) errors.price = 'Price is required';
  if (!formData.bedrooms) errors.bedrooms = 'Number of bedrooms is required';
  if (!formData.bathrooms) errors.bathrooms = 'Number of bathrooms is required';
  if (!formData.area) errors.area = 'Area is required';
  if (!formData.address?.street) errors.street = 'Street address is required';
  if (!formData.address?.city) errors.city = 'City is required';
  if (!formData.address?.state) errors.state = 'State is required';
  if (!formData.propertyType) errors.propertyType = 'Property type is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};