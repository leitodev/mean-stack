import {Component, inject, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatCard} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {PostService} from "../post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIcon} from "@angular/material/icon";
import {mimeType} from "../mime-type.validator";
import {Post} from "../post";

interface Form {
  title: FormControl<string>;
  content: FormControl<string>;
  image: FormControl<File | null>;
}
type ImagePath = Post["imagePath"];

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    FormsModule,
    MatSlideToggle,
    MatCard,
    MatInput,
    MatButton,
    MatFormFieldModule,
    MatProgressSpinner,
    MatIcon,
    ReactiveFormsModule
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit {
  private readonly router = inject(Router);

  mode: 'create' | 'edit' = 'create';
  postId: string = '';
  isLoading = false;
  imagePreview: string = '';
  oldImg: ImagePath;

  form = new FormGroup<Form>({
    title: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    content: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
  });

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty("postId")) {
        this.postId = params['postId'];
        this.mode = 'edit';
        this.isLoading = true;
        const oldPost =  this.postService.getPost(this.postId);

        this.form.setValue({
          title: oldPost.title || '',
          content: oldPost.content || '',
          image: oldPost.image || null,
        })
        this.oldImg = oldPost.imagePath;
        this.isLoading = false;
      }
    });
  }

  sendPost() {
    if (!this.form.valid && !this.oldImg) {
      return;
    }

    const title = this.form.controls.title.value;
    const content = this.form.controls.content.value;
    let image: any = this.form.controls.image.value;

    if (!image && this.oldImg) {
      image = this.oldImg;
    }

    const newPost = {
      id:  Math.floor(Math.random() * 121323).toString(),
      title: title,
      content:  content,
      image:  image,
      short: ''
    };

    if (this.mode === 'edit') {
      this.postService.updatePost({
        id: this.postId,
        title: title,
        content: content,
        image: image,
      });
      return;
    }

    this.postService.addNewPost(newPost); // to db
  }

  onImgPicked(event: Event){
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.form.patchValue({image: file});
      this.form.get('image')?.updateValueAndValidity(); // check validation manually
      this.getBinaryCodeOfImg(file);
    }
  }

  getBinaryCodeOfImg(file: File) {
    const reader = new FileReader(); // need for get binary code of img
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

}
