import { inMemoryQueueManager } from './queues/memory/memory-queue'
import { redisQueueManager } from './queues/redis/redis-queue'
import { QueueMode, system, SystemProp } from '@activepieces/server-shared'

const queueMode = system.get(SystemProp.QUEUE_MODE)
export const flowQueue =
  queueMode === QueueMode.MEMORY ? inMemoryQueueManager : redisQueueManager
