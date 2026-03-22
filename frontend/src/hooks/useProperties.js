import { useState, useEffect } from 'react';
import { useGetPropertiesQuery } from '../redux/api/apiSlice';

const useProperties = (filters = {}, page = 1) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data, isLoading, isError, error: queryError } = useGetPropertiesQuery({
    ...filters,
    pageNumber: page,
  });

  useEffect(() => {
    if (data) {
      setProperties(data.properties);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      setError(queryError);
      setLoading(false);
    }
  }, [isError, queryError]);

  return {
    properties,
    loading: isLoading || loading,
    error,
    totalPages: data?.pages || 1,
    currentPage: data?.page || 1,
    totalProperties: data?.total || 0,
  };
};

export default useProperties;