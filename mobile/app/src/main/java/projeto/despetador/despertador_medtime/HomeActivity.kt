package projeto.despetador.despertador_medtime

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.ImageView
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import java.util.Calendar
import java.io.File
import java.io.FileOutputStream
import org.json.JSONArray
import org.json.JSONObject

class HomeActivity : AppCompatActivity() {

    private lateinit var txtDataSelecionada: TextView
    private lateinit var txtHorarioSelecionado: TextView
    private lateinit var edtDescricao: EditText
    private lateinit var imgPreviewAnexo: ImageView

    private var selectedDate: String = "--/--/----"
    private var selectedTime: String = "--:--"
    private var selectedImagePath: String? = null

    private val pickImageLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        if (uri == null) return@registerForActivityResult
        val copiedPath = copyImageToInternalStorage(uri)
        if (copiedPath != null) {
            selectedImagePath = copiedPath
            val bitmap = BitmapFactory.decodeFile(copiedPath)
            imgPreviewAnexo.setImageBitmap(bitmap)
            imgPreviewAnexo.contentDescription = getString(R.string.cd_imagem_selecionada)
        } else {
            Toast.makeText(this, getString(R.string.msg_erro_anexar_imagem), Toast.LENGTH_SHORT).show()
        }
    }
    private val pickJsonLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        if (uri == null) return@registerForActivityResult
        importAlarmsFromJson(uri)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        txtDataSelecionada = findViewById(R.id.txtDataSelecionada)
        txtHorarioSelecionado = findViewById(R.id.txtHorarioSelecionado)
        edtDescricao = findViewById(R.id.edtDescricao)
        imgPreviewAnexo = findViewById(R.id.imgPreviewAnexo)

        val btnEscolherData = findViewById<Button>(R.id.btnEscolherData)
        val btnEscolherHorario = findViewById<Button>(R.id.btnEscolherHorario)
        val btnAnexarImagem = findViewById<Button>(R.id.btnAnexarImagem)
        val btnImportarJson = findViewById<Button>(R.id.btnImportarJson)
        val btnSalvarDespertador = findViewById<Button>(R.id.btnSalvarDespertador)
        val btnIrTela2 = findViewById<Button>(R.id.btnIrTela2)

        refreshLabels()

        btnEscolherData.setOnClickListener { openDatePicker() }
        btnEscolherHorario.setOnClickListener { openTimePicker() }
        btnAnexarImagem.setOnClickListener { pickImageLauncher.launch("image/*") }
        btnImportarJson.setOnClickListener { pickJsonLauncher.launch("*/*") }

        btnSalvarDespertador.setOnClickListener {
            val descricao = edtDescricao.text.toString().trim()
            if (descricao.isEmpty()) {
                Toast.makeText(this, getString(R.string.msg_campo_descricao), Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            val alarmTime = buildSelectedCalendarTimeInMillis()
            if (alarmTime == null) {
                Toast.makeText(this, getString(R.string.msg_data_hora_obrigatorio), Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (alarmTime <= System.currentTimeMillis()) {
                Toast.makeText(this, getString(R.string.msg_horario_passado), Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            val alarm = AlarmItem(
                id = System.currentTimeMillis().toInt(),
                triggerAtMillis = alarmTime,
                date = selectedDate,
                time = selectedTime,
                description = descricao,
                imagePath = selectedImagePath
            )
            val scheduled = AlarmScheduler.scheduleAlarm(this, alarm)
            if (!scheduled) {
                requestExactAlarmPermissionIfNeeded()
                Toast.makeText(this, getString(R.string.msg_sem_permissao_alarme), Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }
            AlarmRepository.addAlarm(alarm)
            edtDescricao.text?.clear()
            selectedImagePath = null
            imgPreviewAnexo.setImageResource(android.R.color.transparent)
            imgPreviewAnexo.contentDescription = getString(R.string.cd_sem_imagem_selecionada)
            Toast.makeText(this, getString(R.string.msg_despertador_salvo), Toast.LENGTH_SHORT).show()
        }

        btnIrTela2.setOnClickListener {
            startActivity(Intent(this, ScreenTwoActivity::class.java))
        }
    }

    private fun refreshLabels() {
        txtDataSelecionada.text = getString(R.string.label_data, selectedDate)
        txtHorarioSelecionado.text = getString(R.string.label_horario, selectedTime)
    }

    private fun openDatePicker() {
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH)
        val day = calendar.get(Calendar.DAY_OF_MONTH)

        DatePickerDialog(this, { _, y, m, d ->
            selectedDate = String.format("%02d/%02d/%04d", d, m + 1, y)
            refreshLabels()
        }, year, month, day).show()
    }

    private fun openTimePicker() {
        val calendar = Calendar.getInstance()
        val hour = calendar.get(Calendar.HOUR_OF_DAY)
        val minute = calendar.get(Calendar.MINUTE)

        TimePickerDialog(this, { _, h, m ->
            selectedTime = String.format("%02d:%02d", h, m)
            refreshLabels()
        }, hour, minute, true).show()
    }

    private fun buildSelectedCalendarTimeInMillis(): Long? {
        if (selectedDate == "--/--/----" || selectedTime == "--:--") {
            return null
        }
        val dateParts = selectedDate.split("/")
        val timeParts = selectedTime.split(":")
        if (dateParts.size != 3 || timeParts.size != 2) {
            return null
        }

        val day = dateParts[0].toIntOrNull() ?: return null
        val month = dateParts[1].toIntOrNull() ?: return null
        val year = dateParts[2].toIntOrNull() ?: return null
        val hour = timeParts[0].toIntOrNull() ?: return null
        val minute = timeParts[1].toIntOrNull() ?: return null

        return Calendar.getInstance().apply {
            set(Calendar.YEAR, year)
            set(Calendar.MONTH, month - 1)
            set(Calendar.DAY_OF_MONTH, day)
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
    }

    private fun requestExactAlarmPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            startActivity(
                Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                    data = Uri.parse("package:$packageName")
                }
            )
        }
    }

    private fun copyImageToInternalStorage(uri: Uri): String? {
        return try {
            val inputStream = contentResolver.openInputStream(uri) ?: return null
            val fileName = "alarm_image_${System.currentTimeMillis()}.jpg"
            val file = File(filesDir, fileName)
            FileOutputStream(file).use { output ->
                inputStream.use { input -> input.copyTo(output) }
            }
            file.absolutePath
        } catch (_: Exception) {
            null
        }
    }

    private fun importAlarmsFromJson(uri: Uri) {
        try {
            val text = contentResolver.openInputStream(uri)?.bufferedReader()?.use { it.readText() }
            if (text.isNullOrBlank()) {
                Toast.makeText(this, getString(R.string.msg_json_vazio), Toast.LENGTH_SHORT).show()
                return
            }

            val jsonArray = extractAlarmArray(text)
            var importedCount = 0
            var skippedCount = 0

            for (index in 0 until jsonArray.length()) {
                val item = jsonArray.optJSONObject(index)
                if (item == null) {
                    skippedCount++
                    continue
                }

                val builtAlarm = buildAlarmFromJson(item, index)
                if (builtAlarm == null) {
                    skippedCount++
                    continue
                }

                val scheduled = AlarmScheduler.scheduleAlarm(this, builtAlarm)
                if (scheduled) {
                    AlarmRepository.addAlarm(builtAlarm)
                    importedCount++
                } else {
                    skippedCount++
                }
            }

            if (importedCount == 0) {
                requestExactAlarmPermissionIfNeeded()
            }
            Toast.makeText(
                this,
                getString(R.string.msg_importacao_json_resultado, importedCount, skippedCount),
                Toast.LENGTH_LONG
            ).show()
        } catch (_: Exception) {
            Toast.makeText(this, getString(R.string.msg_json_invalido), Toast.LENGTH_LONG).show()
        }
    }

    private fun extractAlarmArray(rawText: String): JSONArray {
        return try {
            JSONArray(rawText)
        } catch (_: Exception) {
            val root = JSONObject(rawText)
            root.optJSONArray("agendamentos")
                ?: root.optJSONArray("alarms")
                ?: JSONArray()
        }
    }

    private fun buildAlarmFromJson(item: JSONObject, index: Int): AlarmItem? {
        val description = item.optString("description")
            .ifBlank { item.optString("descricao") }
            .trim()
        if (description.isBlank()) return null

        val triggerAtMillis = item.optLong("triggerAtMillis")
            .takeIf { it > 0 }
            ?: parseDateAndTimeToMillis(
                date = item.optString("date").ifBlank { item.optString("dia") },
                time = item.optString("time").ifBlank { item.optString("horario") }
            )
            ?: return null

        if (triggerAtMillis <= System.currentTimeMillis()) return null

        val date = item.optString("date")
            .ifBlank { item.optString("dia") }
            .ifBlank { formatDate(triggerAtMillis) }
        val time = item.optString("time")
            .ifBlank { item.optString("horario") }
            .ifBlank { formatTime(triggerAtMillis) }

        val imagePath = when {
            item.has("imageBase64") -> decodeBase64ImageToInternalFile(item.optString("imageBase64"))
            item.has("imagemBase64") -> decodeBase64ImageToInternalFile(item.optString("imagemBase64"))
            else -> {
                val candidate = item.optString("imagePath").ifBlank { item.optString("imagemPath") }
                if (candidate.isBlank()) null else candidate.takeIf { File(it).exists() }
            }
        }

        return AlarmItem(
            id = (System.currentTimeMillis() + index).toInt(),
            triggerAtMillis = triggerAtMillis,
            date = date,
            time = time,
            description = description,
            imagePath = imagePath
        )
    }

    private fun parseDateAndTimeToMillis(date: String, time: String): Long? {
        if (date.isBlank() || time.isBlank()) return null
        val dateParts = date.split("/")
        val timeParts = time.split(":")
        if (dateParts.size != 3 || timeParts.size != 2) return null

        val day = dateParts[0].toIntOrNull() ?: return null
        val month = dateParts[1].toIntOrNull() ?: return null
        val year = dateParts[2].toIntOrNull() ?: return null
        val hour = timeParts[0].toIntOrNull() ?: return null
        val minute = timeParts[1].toIntOrNull() ?: return null

        return Calendar.getInstance().apply {
            set(Calendar.YEAR, year)
            set(Calendar.MONTH, month - 1)
            set(Calendar.DAY_OF_MONTH, day)
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
    }

    private fun decodeBase64ImageToInternalFile(value: String): String? {
        return try {
            if (value.isBlank()) return null
            val pureBase64 = value.substringAfter("base64,", value)
            val bytes = android.util.Base64.decode(pureBase64, android.util.Base64.DEFAULT)
            val file = File(filesDir, "alarm_json_image_${System.currentTimeMillis()}.jpg")
            FileOutputStream(file).use { it.write(bytes) }
            file.absolutePath
        } catch (_: Exception) {
            null
        }
    }

    private fun formatDate(triggerAtMillis: Long): String {
        val calendar = Calendar.getInstance().apply { timeInMillis = triggerAtMillis }
        return String.format(
            "%02d/%02d/%04d",
            calendar.get(Calendar.DAY_OF_MONTH),
            calendar.get(Calendar.MONTH) + 1,
            calendar.get(Calendar.YEAR)
        )
    }

    private fun formatTime(triggerAtMillis: Long): String {
        val calendar = Calendar.getInstance().apply { timeInMillis = triggerAtMillis }
        return String.format(
            "%02d:%02d",
            calendar.get(Calendar.HOUR_OF_DAY),
            calendar.get(Calendar.MINUTE)
        )
    }
}
