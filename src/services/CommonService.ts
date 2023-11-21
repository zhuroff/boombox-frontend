export default class CommonService {
  static errorChecker(status: number) {
    if (status !== 200) {
      throw new Error('Failed request')
    }
  }
}
