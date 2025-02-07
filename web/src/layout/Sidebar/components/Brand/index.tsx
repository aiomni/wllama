import { Link } from 'react-router';
import Logo from '@/assets/aiomni.svg';

const Brand = () => {
  return (
    <div className="cursor-pointer h-[36px] flex justify-start items-center mx-0 my-0">
      <div>
        <img alt='aiomni' width={36} height={36} src={Logo} />
      </div>
      <p className="ml-[10px] text-xs font-bold">
        <Link to="/">
        <span className="text-3xl">W</span>eb O<span  className="text-3xl">llama</span>
        </Link>
      </p>
    </div>
  );
}

export default Brand;
