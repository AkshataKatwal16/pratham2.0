import React, { Suspense } from 'react';

import List from '@learner/components/themantic/content/List';

const title = 'Experimento_India';
export const metadata = {
  title,
  // openGraph: {
  //   title,
  //   type: 'website',
  // },
};

const Page = () => {
  return (
    <div className="thematic-page">
      <Suspense fallback={<div>Loading...</div>}>
        <List />
      </Suspense>
    </div>
  );
};

export default Page;
