import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import QuestionViewer from '../../shared/QuestionViewer';
import { WCP_QUESTIONS, WCP_CATEGORIES } from './data/wecreateproblems.data';

function WeCreateProblemsQuestions() {
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 bg-white border-b border-gray-200">
        <Breadcrumbs />
      </div>
      <QuestionViewer
        questions={WCP_QUESTIONS}
        categories={WCP_CATEGORIES}
        sourceLabel="WeCreateProblems — Angular Interview Questions"
        sourceUrl="https://www.wecreateproblems.com/interview-questions/angular-interview-questions"
        themeColor="rose"
      />
    </div>
  );
}

export default WeCreateProblemsQuestions;
