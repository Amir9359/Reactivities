import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../../../../client-app/src/app/api/agent";
import { Activity, ActivityFormValues } from "../../../../client-app/src/app/models/activity";
import {format} from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profile";
import { pagination, PagingPrams } from "../models/pagination";
 

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination : pagination | null = null;
    pagingParams = new PagingPrams();
    predicate = new Map().set('all' , true);

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingPrams();
                this.activityRegistry.clear();
                this.loadActivities();
            })
    }
    setPagingParams = (pagingParams : PagingPrams)  => {
        this.pagingParams = pagingParams;
    }
    setPredicate = (predicate : string , value : string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value , key) => {
                if(key !== 'startDate') this.predicate.delete(key);
            })
        }
        switch(predicate){
            case 'all':
                resetPredicate();
                this.predicate.set('all' , true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing' , true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost' , true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate' , value);
        }
    }

    get axiosParams () {
        const params = new URLSearchParams();
        params.append('pageNumber' , this.pagingParams.pageNumber.toString());
        params.append('pageSize' , this.pagingParams.pageSize.toString());
        this.predicate.forEach((value , key) => {
            if(key === 'startDate'){
                params.append(key , (value as Date).toISOString());
            }else {
                params.append(key, value);
            }
        })
        return params;
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const result = await agent.Activities.list(this.axiosParams);
            result.data.forEach(activity => {
                this.setActivity(activity);
            })
            this.setPagintion(result.pagination);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setPagintion = (pagination : pagination ) => {
        this.pagination = pagination;
    }
    
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if(user)
        {
            activity.isGoinng = activity.attendees!.some(
                x=> x.username === user.username)
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x=> x.username === activity.hostUsername);
        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user= store.userStore.user;
        const attendee = new Profile(user!); 
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error);
 
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
 
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if(activity.id)
                {
                    let updatedActivity = {...this.getActivity(activity.id), ...activity}
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
 
            })
        } catch (error) {
            console.log(error);
 
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    // cansel attendance if user in attendance and if not add user to attendace . 
    updateAttendance = async () => {
        const user = await store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if(this.selectedActivity?.isGoinng){
                    this.selectedActivity.attendees =
                     this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                     this.selectedActivity.isGoinng =false;
                }
                else {
                    const attend = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attend);
                    this.selectedActivity!.isGoinng = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        }catch(error){
            console.log(error);
        }finally{
            runInAction(() =>   this.loading = false )
      
        }
    }

    cansellActivityToggle = async () => {
        this.loading = true;
        try{
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCanselled = !this.selectedActivity!.isCanselled;
                this.activityRegistry.set(this.selectedActivity!.id , this.selectedActivity!);
            })
        }catch(error){
            console.log(error);
        }finally{
            runInAction(() => this.loading = false)
        }
    }
    clearSelectedActivity = () => {
        this.selectedActivity = undefined; 
    }

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees?.forEach(attendee => {
                if(attendee.username === username){
                    attendee.following ? attendee.followerCount-- : attendee.followerCount++;
                    attendee.following = ! attendee.following;
                }
            })
        })
    }
}