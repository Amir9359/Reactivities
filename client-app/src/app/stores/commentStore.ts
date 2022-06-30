import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
    comments : ChatComment[] = [];
    hubConnection : HubConnection | null = null;

 
    constructor() {
        makeAutoObservable(this)
    }

    createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/chat?activityId=' + activityId , {
                accessTokenFactory : () => store.userStore.user?.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.start().catch(error => console.log("Error Stablishing the Connection: ", error));


        this.hubConnection.on('LoadComments' , (comments : ChatComment[]) => {
            runInAction(() => {
                comments.forEach(comment => {
                    comment.createAt = new Date(comment.createAt + 'Z');
                })
                this.comments = comments
             });
        })

        this.hubConnection.on('ReciveComment' , (comment : ChatComment) => {
            runInAction(() => { 
                comment.createAt = new Date(comment.createAt);
                this.comments.unshift(comment)
            });
        })
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log("Error Stopping connection: ", error))
    }

    clearComments = () => {
        this.comments = [] ;
        this.stopHubConnection();
    }

    addComment = async (values : any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke('SendComment', values);
        }catch(error) {
            console.log(error);
        }
    }
}