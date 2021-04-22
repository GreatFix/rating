class History {
  string = ''

  add(hash) {
    this.string = this.string + ',' + hash
  }
  back() {
    const index = this.string.lastIndexOf(',')
    const hash = this.string.slice(index + 1)
    this.string = this.string.substring(0, index)
    return hash
  }
  clear() {
    this.string = ''
  }
}

export default new History()
