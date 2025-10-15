import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { QuizService } from "../shared/services/quiz.service";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  standalone: false
})
export class QuizComponent implements OnInit {
  isQuizFinished = this.quizService.isQuizFinished;
  playerName = '';

  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.quizService.playerName = params['playerName'];
      this.playerName = params['playerName'];
      const categoryId = params['categoryId'];
               
      this.quizService.resetQuiz();
      
      if (categoryId) {
        this.quizService.getQuizContentByCategory(+categoryId);
      } else {
        this.quizService.getQuizContent();
      }
    });
  }

  goToResultPage() {
    this.router.navigate(['/result']);
  }
}
