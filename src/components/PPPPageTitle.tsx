import TypeChecker from 'prop-types';
import { Dosis } from '@next/font/google';

const dosis = Dosis({ 
  weight: '700',
  subsets: ['latin'] 
});

//@ts-ignore
const PPPPageTitle = ({ title }) => {
  return (
    <h2 className={dosis.className}>{title}</h2>
  );
};

PPPPageTitle.propTypes = {
  title: TypeChecker.string.isRequired,
};
export default PPPPageTitle;