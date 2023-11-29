export default class CommonService {
  static errorChecker(status: number) {
    if (![200, 201, 204].includes(status)) {
      throw new Error('Failed request')
    }
  }
}
