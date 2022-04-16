import { FeedbackCategories } from './feedbackCategories';

export interface Feedback {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  text: string;
  feedbackCategory: FeedbackCategories;
  cateringFacilityId: string;
}
