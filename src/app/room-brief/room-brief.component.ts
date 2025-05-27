import { Component, Input } from '@angular/core';
import { RoomBriefData } from '../../interfaces/room-brief-data';

@Component({
  selector: 'app-room-brief',
  imports: [],
  templateUrl: './room-brief.component.html',
  styleUrl: './room-brief.component.css'
})
export class RoomBriefComponent {
  @Input() roomData!: RoomBriefData;
}
