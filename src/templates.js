// All templates start
import { toPascalCase } from './helpers.js'

export const pageTemplate = (sliceName) => {
  return `
import { PageLayout } from '@features/layouts';
import { HeaderWidget } from '@widgets/header';
import { TabPage } from '@ui';

const ${toPascalCase(sliceName)}Index = () => {
  const tabs = ['Tab1', 'Tab2', 'Tab3', 'Tab4'];

  return (
    <div className="h-full w-full">
      <HeaderWidget />
      <PageLayout>
         
          <div className="bg-white rounded-lg p-12">
            <TabPage
              tabs={tabs}
              components={[<div></div>,<div></div>,<div></div>,<div></div>]}
            />
          </div>
       
      </PageLayout>
    </div>
  );
};

export default ${toPascalCase(sliceName)}Index;`
}

export const sliceTemplate = (sliceName) => {
  return `
    export const ${toPascalCase(sliceName)} = () => {
        // return <div>${toPascalCase(sliceName)}</div>;
    }
      `
}
// All Templates end
