package projeto.despetador.despertador_medtime

object AlarmRepository {
    private val alarms = mutableListOf<AlarmItem>()

    fun addAlarm(item: AlarmItem) {
        alarms.add(item)
    }

    fun getAlarms(): List<AlarmItem> = alarms.toList()
}
