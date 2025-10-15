import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  quizContent: any[] = [];
  playerAnswers: {questionId: number; answer: string}[] = [];
  score = 0;
  isQuizFinished = false;
  playerName: string = '';

  constructor(private http: HttpClient) { }

  checkAnswers() {
    this.score = 0;
    for (let i = 0; i < this.playerAnswers.length; i++) {
      const question = this.quizContent.find((q) => q.id === this.playerAnswers[i].questionId);
      if (!question) continue;
      for (let j = 0; j < question.answers.length; j++) {
        const currentAnswer = question.answers[j];
        if (currentAnswer?.isCorrect && this.playerAnswers[i].answer === currentAnswer.answerLabel) {
          this.score += 1;
          break;
        }
      }
    }
    this.isQuizFinished = true;
  }

  addAnswer(answer: string, questionId: number) {
    const isAnswered = this.playerAnswers.find((a) => a.questionId === questionId);
    if (isAnswered) {
      isAnswered.answer = answer;
      return;
    }
    this.playerAnswers.push({questionId, answer});
  }

  getQuizContent() {
    this.quizContent = [];
    this.http.get('http://localhost:3000/questions').subscribe((questions: any) => {
      if (!questions || questions.length === 0) {
        console.warn('Aucune question trouvée');
        return;
      }
      
      const answersRequests = questions.map((question: any) => 
        this.http.get(`http://localhost:3000/answers?questionId=${question.id}`)
      );
      
      forkJoin(answersRequests).subscribe((answersArray: any) => {
        this.quizContent = questions.map((question: any, index: number) => ({
          id: question.id,
          question: question.questionLabel,
          answers: answersArray[index]
        }));
        console.log('Questions chargées:', this.quizContent.length);
      });
    });
  }

  getQuizContentByCategory(categoryId: number) {
    this.quizContent = [];
    this.http.get(`http://localhost:3000/questions?categoryId=${categoryId}`).subscribe((questions: any) => {
      if (!questions || questions.length === 0) {
        console.warn(`Aucune question trouvée pour la catégorie ${categoryId}`);
        return;
      }
      
      const answersRequests = questions.map((question: any) => 
        this.http.get(`http://localhost:3000/answers?questionId=${question.id}`)
      );
      
      forkJoin(answersRequests).subscribe((answersArray: any) => {
        this.quizContent = questions.map((question: any, index: number) => ({
          id: question.id,
          question: question.questionLabel,
          answers: answersArray[index]
        }));
        console.log(`Questions de la catégorie ${categoryId} chargées:`, this.quizContent.length);
      });
    });
  }

  resetQuiz() {
    this.quizContent = [];
    this.playerAnswers = [];
    this.score = 0;
    this.isQuizFinished = false;
  }
}
