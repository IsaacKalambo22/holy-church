const Header = ({
  title,
  subtitle,
  rightElement,
}: HeaderProps) => {
  return (
    <div className='mb-7 flex justify-between items-center'>
      <div>
        <h1 className='text-2xl font-bold'>
          {title}
        </h1>
        {subtitle && (
          <p className='text-sm text-gray-500 mt-1'>
            {subtitle}
          </p>
        )}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};

export default Header;
