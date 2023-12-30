class PromiseQueue {
  private queue: (() => Promise<any>)[] = []
  private executing: boolean = false

  enqueue(task: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          const result = await task()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      this.queue.push(wrappedTask)

      if (!this.executing) {
        this.executeNext()
      }
    })
  }

  public empty() {
    this.executing = false
    this.queue = []
  }

  private async executeNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.executing = false
      return
    }
    const task = this.queue.shift()
    if (task) {
      this.executing = true
      await task()
      this.executeNext()
    }
  }
}

export default PromiseQueue