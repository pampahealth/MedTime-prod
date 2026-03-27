package projeto.despetador.despertador_medtime

data class AlarmItem(
    val id: Int,
    val triggerAtMillis: Long,
    val date: String,
    val time: String,
    val description: String,
    val imagePath: String?
)
