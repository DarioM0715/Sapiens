import { ArrowRight } from "lucide-react";
import { FaBookmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

interface Props {
  product: Product;
}

export const CardInfo = ({ product }: Props) => {
  const { name, description, image, category } = product;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/products#${category}`);
  };

  return (
    <div id={`${category}`} className="flex flex-col gap-4 p-4 bg-white  shadow-lg">
      <h2 className="font-bold text-2xl">{name}</h2>

      <img src="https://picsum.photos/id/10/400/300" alt="product" className="rounded-sm" />

      <div className="flex flex-col gap-1">
        <h3>{description}</h3>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <FaBookmark size={20} className="icon-primary" />
            <span className="text-gray-600"> 7 variantes</span>
          </div>

          <button title="nav" onClick={handleNavigate} className="flex items-center justify-center bg-primary cursor-pointer rounded-full p-2 ">
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
