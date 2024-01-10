// All templates start
const { toCamelCase, toPascalCase } = require('./helpers.js')

const pageTemplate = (sliceName) => {
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
const uiTemplate = (sliceName) => {
  return `
  export const ${toPascalCase(sliceName)} = () => {
      // return <div>${toPascalCase(sliceName)}</div>;
  };`
}
const apiTemplate = (sliceName) => {
  return `
    import { apiClient } from '@services';
    export const get${toPascalCase(
      sliceName
    )}Request= (params:unkown) => apiClient.client.get('/${sliceName}',params);
    export const post${toPascalCase(
      sliceName
    )}Request= params => apiClient.client.post('/${sliceName}',params);
    export const update${toPascalCase(
      sliceName
    )}Request= params => apiClient.client.put('/${sliceName}',params);
    export const delete${toPascalCase(
      sliceName
    )}Request= params => apiClient.client.delete('/${sliceName}',params);
  `
}
const typeTemplate = (sliceName) => {
  return `
import { TPagination } from '@types';

export type T${toPascalCase(sliceName)}Response = {
  ${toCamelCase(sliceName)}: T${toPascalCase(sliceName)};
  ${toCamelCase(sliceName)}Limit: number;
  ${toCamelCase(sliceName)}Access: boolean;
  attemptsGet${toPascalCase(sliceName)}PerYear: number;
};
export type T${toPascalCase(sliceName)}RecordStatus = {
  name: string;
  label: string;
  class: string;
};

export type T${toPascalCase(sliceName)}Record = {
  id: number;
  userId: number;
  size: string;
  offeredAt: string;
  status: T${toPascalCase(sliceName)}RecordStatus;
  denied: boolean | null;
};

export type T${toPascalCase(sliceName)} = {
  data: T${toPascalCase(sliceName)}Record[];
  pagination: TPagination;
};
`
}
const sliceTemplate = (sliceName, layer = null) => {
  if (layer === null) uiTemplate(sliceName)
  let result = ''
  switch (layer) {
    case 'ui':
      result = uiTemplate(sliceName)
      break
    case 'api':
      result = apiTemplate(sliceName)
      break
    case 'types':
      result = typeTemplate(sliceName)
      break
  }
  return result
}
// All Templates end
module.exports = {
  pageTemplate,
  uiTemplate,
  apiTemplate,
  typeTemplate,
  sliceTemplate,
}
