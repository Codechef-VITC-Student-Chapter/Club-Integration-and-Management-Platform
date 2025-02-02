import CCLogo from '../assets/dashboard_cclogo.png';

const Badge = ({ badges }) => {
    return (
        <>
            {
                badges.map((badge, index) => ( // Changed key to index
                    <div key={index} className='w-max max-w-[100px] h-full text-start flex flex-col items-center'>
                        <img src={CCLogo} alt="Badge logo" className='' />
                        <span className='text-wrap text-center'>{badge}</span>
                    </div>
                ))
            }
        </>
    );
}

export default Badge