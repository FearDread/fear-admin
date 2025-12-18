import React from 'react';
import PopularBrands from '../../components/common/PopularBrands';
import PopularCategories from '../../components/common/PopularCategories';

export const ShopCategories = () => {
  return (
    <>
      <PopularCategories />
      <PopularBrands />
    </>
  );
}

export default ShopCategories;
