import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { CarouselComponent } from '../../../../shared/components/carousel/carousel.component';
import { RepertoireImageService } from '../../../../core/services/repertoire-image.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, CarouselComponent],
  templateUrl: './recommendations.component.html'
})
export class RecommendationsComponent implements OnInit {
  private imageService = inject(RepertoireImageService);
  private langService = inject(LanguageService);

  content = this.langService.content;
  images = this.imageService.recommendations;
  loading = this.imageService.loading;

  async ngOnInit(): Promise<void> {
    await this.imageService.loadRecommendations();
  }
}
