import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import AnnouncementItem from '../../components/common/AnnouncementItem.jsx'
import KPICard from '../../components/cards/KPICard.jsx'
import {User2, House, PiggyBank} from 'lucide-react'
import EarningChart from '../../components/common/EarningChart.jsx'

const Dashboard = ({}) => {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <div className='flex space-x-6 h-54 px-5'>
            <div className='bg-white h-full text-primary-text rounded-xl 
                flex flex-col space-y-5 justify-center px-8 w-[50%]'>
                <h2 className='font-semibold'>Wallet</h2>
                <h1 className='text-[45px] font-extrabold leading-none'>#238,000,909</h1>
            </div>
            <div className="flex flex-col rounded-xl space-y-5 w-[50%] bg-white border h-full 
                    border-primary shadow-2xl p-5">
                <h2 className='text-sm text-primary font-semibold'>Recent Announcements</h2>
                <AnnouncementItem title="Pending User" description="We will be performing system maintenance on Saturday, November 18th from ..." />
                <AnnouncementItem title="Pending User" description="We will be performing system maintenance on Saturday, November 18th from ..." />
            </div>
        </div>
        <div className="flex space-x-6 h-50 px-5">
            <KPICard title="Organizations" value="2,345" icon={User2} />
            <KPICard title="Individuals" value="10,000" icon={PiggyBank} />
            <KPICard title="Pending Users" value="9" icon={PiggyBank} />
            <KPICard title="Active users" value="900" icon={House} />
            <KPICard title="Rejected Users" value="87" icon={PiggyBank} />
            <KPICard title="Saving Plans" value="34" icon={PiggyBank} />
        </div>
        <div className="flex space-x-6 h-fit px-5">
            <EarningChart />
            <EarningChart />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard