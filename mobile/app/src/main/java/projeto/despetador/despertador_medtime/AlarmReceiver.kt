package projeto.despetador.despertador_medtime

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val alarmIntent = Intent(context, AlarmRingingActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra(AlarmScheduler.EXTRA_ALARM_ID, intent.getIntExtra(AlarmScheduler.EXTRA_ALARM_ID, 0))
            putExtra(AlarmScheduler.EXTRA_ALARM_DATE, intent.getStringExtra(AlarmScheduler.EXTRA_ALARM_DATE))
            putExtra(AlarmScheduler.EXTRA_ALARM_TIME, intent.getStringExtra(AlarmScheduler.EXTRA_ALARM_TIME))
            putExtra(AlarmScheduler.EXTRA_ALARM_DESCRIPTION, intent.getStringExtra(AlarmScheduler.EXTRA_ALARM_DESCRIPTION))
            putExtra(AlarmScheduler.EXTRA_ALARM_IMAGE_PATH, intent.getStringExtra(AlarmScheduler.EXTRA_ALARM_IMAGE_PATH))
        }
        context.startActivity(alarmIntent)
    }
}
