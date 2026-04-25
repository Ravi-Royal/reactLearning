import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import QuestionViewer from '../../shared/QuestionViewer';
import { GREATFRONTEND_QUESTIONS, GREATFRONTEND_CATEGORIES } from './data/greatfrontend.data';

function GreatFrontEndQuestions() {
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 bg-white border-b border-gray-200">
        <Breadcrumbs />
      </div>
      <QuestionViewer
        questions={GREATFRONTEND_QUESTIONS}
        categories={GREATFRONTEND_CATEGORIES}
        sourceLabel="greatfrontend/top-angular-interview-questions"
        sourceUrl="https://github.com/greatfrontend/top-angular-interview-questions"
        themeColor="cyan"
      />
    </div>
  );
}

export default GreatFrontEndQuestions;
