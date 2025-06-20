import PrimaryButton from "../components/common/PrimaryButton";

const Test2 = () => {
  return (
    <div className="flex flex-col space-y-2">
      {/* PrimaryButton */}
      <p className="text-[2rem]">Middium</p>
      <PrimaryButton size="Meddium" color="Main" shape="Round" label="Home" />
      <PrimaryButton size="Meddium" color="Main" shape="Square" label="Test1" />
      <PrimaryButton
        size="Meddium"
        color="Sub"
        shape="Round"
        label="アップグレード"
      />
      <PrimaryButton
        size="Meddium"
        color="Sub"
        shape="Square"
        label="アップグレード"
      />
      <br />
      <p className="text-[2rem]">Large</p>
      <PrimaryButton
        size="Large"
        color="Main"
        shape="Round"
        label="アップグレード"
      />
      <PrimaryButton
        size="Large"
        color="Main"
        shape="Square"
        label="アップグレード"
      />
      <PrimaryButton
        size="Large"
        color="Sub"
        shape="Round"
        label="アップグレード"
      />
      <PrimaryButton
        size="Large"
        color="Sub"
        shape="Square"
        label="アップグレード"
      />
    </div>
  );
};

export default Test2;
