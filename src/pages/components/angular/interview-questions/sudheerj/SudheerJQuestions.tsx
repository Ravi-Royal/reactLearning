import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import QuestionViewer from '../../shared/QuestionViewer';
import { SUDHEERJ_QUESTIONS, SUDHEERJ_CATEGORIES } from './data/sudheerj.data';

function SudheerJQuestions() {
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 bg-white border-b border-gray-200">
        <Breadcrumbs />
      </div>
      <QuestionViewer
        questions={SUDHEERJ_QUESTIONS}
        categories={SUDHEERJ_CATEGORIES}
        sourceLabel="sudheerj/angular-interview-questions"
        sourceUrl="https://github.com/sudheerj/angular-interview-questions"
        themeColor="violet"
      />
    </div>
  );
}

export default SudheerJQuestions;
