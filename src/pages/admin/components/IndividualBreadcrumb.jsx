import React from 'react';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';

export default function IndividualBreadcrumb({ name }) {
  return (
    <Breadcrumb
      parentLabel="Individual"
      parentTo="/individual"
      currentLabel={name || 'Individual'}
    />
  );
}
