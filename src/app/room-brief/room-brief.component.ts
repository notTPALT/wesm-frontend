import { Component, Input } from '@angular/core';
import { RoomBriefData } from '../../interfaces/room-brief-data';
import { RoomDetailsComponent } from "../room-details/room-details.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-brief',
  imports: [CommonModule, RoomDetailsComponent],
  templateUrl: './room-brief.component.html',
  styleUrl: './room-brief.component.css'
})
export class RoomBriefComponent {
  @Input() roomData!: RoomBriefData;
  showRoomDetails: boolean = false;

  toggleRoomDetails() {
    this.showRoomDetails = !this.showRoomDetails;
  }
}
