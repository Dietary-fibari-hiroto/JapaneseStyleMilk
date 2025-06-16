import ResImagesRoute from "../assets/images/ImagesRoute";
import NavItem from "../components/common/NavItem";

const Test = () => {
  return (
    <div>
      <NavItem pathname="/home" icon={ResImagesRoute.home_icon} name="ホーム" />
    </div>
  );
};

export default Test;
