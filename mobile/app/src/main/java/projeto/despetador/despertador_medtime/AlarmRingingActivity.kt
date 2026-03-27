package projeto.despetador.despertador_medtime

import android.media.AudioAttributes
import android.media.Ringtone
import android.media.RingtoneManager
import android.graphics.BitmapFactory
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.io.File

class AlarmRingingActivity : AppCompatActivity() {

    private var ringtone: Ringtone? = null
    private var vibrator: Vibrator? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_alarm_ringing)

        val date = intent.getStringExtra(AlarmScheduler.EXTRA_ALARM_DATE).orEmpty()
        val time = intent.getStringExtra(AlarmScheduler.EXTRA_ALARM_TIME).orEmpty()
        val description = intent.getStringExtra(AlarmScheduler.EXTRA_ALARM_DESCRIPTION).orEmpty()
        val imagePath = intent.getStringExtra(AlarmScheduler.EXTRA_ALARM_IMAGE_PATH)

        findViewById<TextView>(R.id.txtAlarmInfo).text =
            getString(R.string.alarm_ringing_info, date, time, description)
        val alarmImage = findViewById<ImageView>(R.id.imgAlarmAnexada)
        if (!imagePath.isNullOrBlank() && File(imagePath).exists()) {
            val bitmap = BitmapFactory.decodeFile(imagePath)
            alarmImage.setImageBitmap(bitmap)
            alarmImage.contentDescription = getString(R.string.cd_imagem_alarme)
        } else {
            alarmImage.setImageResource(android.R.color.transparent)
            alarmImage.contentDescription = getString(R.string.cd_sem_imagem_alarme)
        }

        findViewById<Button>(R.id.btnDesligarAlarme).setOnClickListener {
            stopAlarmAndFinish()
        }
    }

    override fun onStart() {
        super.onStart()
        startRingtone()
        startVibration()
    }

    override fun onStop() {
        super.onStop()
        stopAlarm()
    }

    private fun startRingtone() {
        val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        ringtone = RingtoneManager.getRingtone(this, alarmUri)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            ringtone?.isLooping = true
        }
        ringtone?.play()
    }

    private fun startVibration() {
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val manager = getSystemService(VIBRATOR_MANAGER_SERVICE) as VibratorManager
            manager.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(VIBRATOR_SERVICE) as Vibrator
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator?.vibrate(
                VibrationEffect.createWaveform(longArrayOf(0, 400, 500), 0),
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .build()
            )
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(longArrayOf(0, 400, 500), 0)
        }
    }

    private fun stopAlarm() {
        ringtone?.stop()
        vibrator?.cancel()
    }

    private fun stopAlarmAndFinish() {
        stopAlarm()
        finish()
    }
}
