package projeto.despetador.despertador_medtime

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val edtUsuario = findViewById<EditText>(R.id.edtUsuario)
        val edtSenha = findViewById<EditText>(R.id.edtSenha)
        val btnEntrar = findViewById<Button>(R.id.btnEntrar)
        val btnCadastrar = findViewById<Button>(R.id.btnCadastrar)

        btnEntrar.setOnClickListener {
            navigateToHome()
            Toast.makeText(this, getString(R.string.msg_login_sucesso), Toast.LENGTH_SHORT).show()
        }

        btnCadastrar.setOnClickListener {
            edtUsuario.text?.clear()
            edtSenha.text?.clear()
            Toast.makeText(this, getString(R.string.msg_cadastro_sucesso), Toast.LENGTH_SHORT).show()
            navigateToHome()
        }
    }

    private fun navigateToHome() {
        startActivity(Intent(this, HomeActivity::class.java))
    }
}
