package projeto.despetador.despertador_medtime

import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import androidx.appcompat.app.AppCompatActivity

class ScreenTwoActivity : AppCompatActivity() {

    private lateinit var listAgendamentos: ListView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_screen_two)

        listAgendamentos = findViewById(R.id.listAgendamentos)
        val btnIrTela1 = findViewById<Button>(R.id.btnIrTela1)

        btnIrTela1.setOnClickListener {
            startActivity(Intent(this, HomeActivity::class.java))
        }
    }

    override fun onResume() {
        super.onResume()
        val alarms = AlarmRepository.getAlarms()
        val items = if (alarms.isEmpty()) {
            listOf(getString(R.string.sem_agendamentos))
        } else {
            alarms.map { "Dia: ${it.date} | Hora: ${it.time}\nDescricao: ${it.description}" }
        }
        listAgendamentos.adapter = ArrayAdapter(
            this,
            android.R.layout.simple_list_item_1,
            items
        )
    }
}
