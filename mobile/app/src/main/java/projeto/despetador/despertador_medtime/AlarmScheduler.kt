package projeto.despetador.despertador_medtime

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build

object AlarmScheduler {

    fun scheduleAlarm(context: Context, alarmItem: AlarmItem): Boolean {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, AlarmReceiver::class.java).apply {
            putExtra(EXTRA_ALARM_ID, alarmItem.id)
            putExtra(EXTRA_ALARM_DATE, alarmItem.date)
            putExtra(EXTRA_ALARM_TIME, alarmItem.time)
            putExtra(EXTRA_ALARM_DESCRIPTION, alarmItem.description)
            putExtra(EXTRA_ALARM_IMAGE_PATH, alarmItem.imagePath)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            alarmItem.id,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
                return false
            }

            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                alarmItem.triggerAtMillis,
                pendingIntent
            )
            true
        } catch (_: SecurityException) {
            false
        }
    }

    const val EXTRA_ALARM_ID = "extra_alarm_id"
    const val EXTRA_ALARM_DATE = "extra_alarm_date"
    const val EXTRA_ALARM_TIME = "extra_alarm_time"
    const val EXTRA_ALARM_DESCRIPTION = "extra_alarm_description"
    const val EXTRA_ALARM_IMAGE_PATH = "extra_alarm_image_path"
}
