 
import { Profile } from "./profile";

export interface Activity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername?: string;
    isCanselled?: boolean;
    isGoinng?: boolean;
    isHost?: boolean;
    host?: Profile;
    attendees?: Profile[];
  }
  export class Activity implements Activity {
    constructor(init?: ActivityFormValues)
    {
      Object.assign(this,init);
    }
  }
  export class ActivityFormValues {
    id?: string | undefined ;
    title: string = '' ;
    description: string = '' ;
    category: string = '' ;
    date: Date | null = null;
    city : string = '';
    venue: string = '';

    constructor(activity?: ActivityFormValues)
    {
      if(activity)
      {
        this.id = activity.id;
        this.category = activity.category;
        this.title = activity.title;
        this.description = activity.description;
        this.date = activity.date ;
         this.city = activity.city ; 
         this.venue = activity.venue ;
      }
    }
  }