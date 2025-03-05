interface HeaderTextProps {
  title: string;
  subtitle?: string;
}

const HeaderText = ({
  title,
  subtitle,
}: HeaderTextProps) => {
  return (
    <h1 className='text-center mt-5 font-bold text-3xl sm:text-4xl leading-snug'>
      <span className='blue_gradient'>
        {title}
      </span>
      <br />
      <span className='blue_subtitle'>
        {subtitle}
      </span>
      <br />
    </h1>
  );
};

export default HeaderText;
