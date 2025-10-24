import { SUBMISSION_QUEUE } from "../utils/constants";
import { redis as connection} from "../core/redis";
import { Job, Worker } from "bullmq";

const submissionWorkerHandler = async (job: Job) => {

}

const submissionWorker = new Worker(SUBMISSION_QUEUE, submissionWorkerHandler, {
    connection: connection
});
