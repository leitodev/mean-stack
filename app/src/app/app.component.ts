import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PostCreateComponent} from "./posts/post-create/post-create.component";
import {HeaderComponent} from "./header/header.component";
import {PostListComponent} from "./posts/post-list/post-list.component";
import {Post} from "./posts/post";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PostCreateComponent, HeaderComponent, PostListComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'app';
}
