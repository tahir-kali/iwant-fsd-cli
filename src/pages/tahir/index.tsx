import { PageLayout } from '@features/layouts'
import { HeaderWidget } from '@widgets/header'
import { TabPage } from '@ui'

const TahirIndex = () => {
  const tabs = ['Tab1', 'Tab2', 'Tab3', 'Tab4']

  return (
    <div className="h-full w-full">
      <HeaderWidget />
      <PageLayout>
        <div className="bg-white rounded-lg p-12">
          <TabPage
            tabs={tabs}
            components={[<div></div>, <div></div>, <div></div>, <div></div>]}
          />
        </div>
      </PageLayout>
    </div>
  )
}

export default TahirIndex
