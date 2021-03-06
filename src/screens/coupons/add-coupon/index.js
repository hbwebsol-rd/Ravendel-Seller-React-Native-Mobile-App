import React from 'react';
import AppHeader from '../../components/header';
import AddCouponsForm from './view';

const AddCouponsScreen = ({navigation}) => {
  return (
    <>
      <AppHeader title="Add Coupons" navigation={navigation} back />
      <AddCouponsForm navigation={navigation} />
    </>
  );
};

export default AddCouponsScreen;
