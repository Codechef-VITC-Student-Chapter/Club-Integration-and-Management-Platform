import Profile from '../assets/dashboard_Profile.png';
import CCLogo from '../assets/dashboard_cclogo.png';

const ProfileCard = ({ isAdmin = true, FirstName = "FirstName", LastName = "LastName", badges = [] }) => {
    return (
        <div className={`bg-[#2E3446] ${isAdmin ? 'h-full md:h-[85%]' : 'h-full'} rounded-3xl flex flex-col p-4 gap-3 justify-center items-center`}>
            <img src={Profile} alt="" className='aspect-square mx-8 mt-8' />
            <div className='flex flex-col h-full w-full justify-between items-center text-center'>
                <div className='lg:text-xl text-md'>
                    <div className='flex sm:gap-3 gap-0 sm:flex-row flex-col justify-center items-center'>
                        <span>{FirstName}</span>
                        <span>{LastName}</span>
                    </div>
                    <span>22BCE5007</span>
                </div>
                <div className='md:flex hidden w-full justify-start'>
                    <Badges badges={badges} />
                </div>
            </div>
        </div>
    )
}

export const Badges = ({ badges }) => {
    return (
        <>
            {
                badges.map((badge, key) => (
                    <div className='w-max max-w-[100px] h-full text-start flex flex-col items-center'>
                        <img src={CCLogo} alt="" className='' />
                        <span className='text-wrap text-center'>{badge}</span>
                    </div>
                ))
            }
        </>
    )
}

export default ProfileCard;