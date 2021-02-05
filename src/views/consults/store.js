export default {
  state: {
    member: {},
    accessInfo: {},
    record: [],
    user: {},
    sendOpt: {},
    ws: {},
    consultId: 0,
  },
  setMember(member){
    this.state.member = member
  },
  setAccessInfo(accessInfo){
    this.state.accessInfo = accessInfo
  },
  setRecord(record){
    this.state.record = record
  },
  setUser(user){
    this.state.user = user
  },
  setSendOpt(sendOpt){
    this.state.sendOpt = sendOpt
  },
  setWs(ws){
    this.state.ws = ws
  },
  setConsultId(consultId){
    this.state.consultId = consultId
  }
}