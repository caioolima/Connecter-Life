import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Terms/privacy.css"; // Certifique-se de importar o arquivo CSS corretamente

const PrivacyPolicy = () => {
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div>
      <div className="logo_term">
        <Link to="/home">ConnecterLife</Link>
      </div>
      <hr />

      <div className="privacy-container">
        <div className="privacy-policy-container">
          <h1>Política de Privacidade</h1>

          <p className="date">Em vigor em 6 de janeiro de 2024</p>

          <p>
            Bem-vindo à TravelConnect, a rede social dedicada a viajantes,
            mochileiros e entusiastas de aventuras. Esta Política de Privacidade
            explica como coletamos, usamos, compartilhamos e protegemos suas
            informações ao usar nossos serviços. Recomendamos a leitura atenta
            deste documento.
          </p>

          <button className="privacy-question" onClick={toggleAnswer}>
            O que é a Política de Privacidade e o que ela aborda?{" "}
            <span className={`arrow ${showAnswer ? "up" : "down"}`}>➔</span>
          </button>

          {showAnswer && (
            <p className="privacy-answer">
              A Política de Privacidade é um documento que descreve como
              coletamos, usamos, compartilhamos e protegemos suas informações
              pessoais. Ela é fundamental para garantir a transparência e a
              proteção da privacidade dos indivíduos que utilizam um serviço ou
              plataforma.
            </p>
          )}

          <h2 className="privacy-section">1. Informações que Coletamos</h2>
          <p className="privacy-content">
            As informações que coletamos e tratamos sobre você dependem do seu
            uso da TravelConnect. Isso inclui dados fornecidos ao criar um
            perfil, compartilhar histórias de viagens, interagir com outros
            usuários e utilizar nossos recursos.
          </p>

          <h2 className="privacy-section">2. Controle de Privacidade</h2>
          <p className="privacy-content">
            É importante para nós que você tenha controle sobre suas
            informações. Por isso, disponibilizamos configurações em sua conta
            para gerenciar suas preferências de privacidade.
          </p>

          <h2 className="privacy-section">3. Como Usamos Suas Informações</h2>
          <p className="privacy-content">
            Explique detalhes sobre o uso das informações pela TravelConnect,
            incluindo o tempo que mantemos as informações e os critérios para
            retenção.
          </p>

          <h2 className="privacy-section">
            4. Compartilhamento de Informações
          </h2>
          <p className="privacy-content">
            Informe sobre como as informações são compartilhadas na
            TravelConnect, incluindo casos de resposta a solicitações legais,
            cumprimento da legislação aplicável e promoção da segurança e
            proteção.
          </p>

          <h2 className="privacy-section">
            5. Por Quanto Tempo Mantemos Suas Informações
          </h2>
          <p className="privacy-content">
            Mantemos as informações pelo tempo necessário para oferecer nossos
            Produtos, cumprir as obrigações legais ou proteger nossos interesses
            ou os de outras pessoas. Decidimos por quanto tempo precisamos delas
            conforme o caso. Consideramos os seguintes fatores para tomar uma
            decisão:
            <ul>
              <li>
                Se precisamos das informações para operar ou oferecer nossos
                Produtos. Por exemplo, precisamos reter alguns dos seus dados
                para manter sua conta.
              </li>
              <li>
                O recurso para o qual usamos essas informações e como ele
                funciona. Por exemplo, as mensagens enviadas no modo temporário
                do Messenger são retidas por menos tempo do que as normais.
              </li>
              <li>
                Durante quanto tempo precisamos reter as informações para
                cumprir certas obrigações legais.
              </li>
              <li>
                Se precisamos dessas informações para outros fins legítimos,
                como evitar danos; investigar possíveis violações dos nossos
                termos ou políticas; promover a segurança, a proteção e a
                integridade; ou proteger a nós mesmos, incluindo nossos
                direitos, nossa propriedade ou nossos produtos.
              </li>
            </ul>
          </p>

          <h2 className="privacy-section">
            6. Como Transferimos as Informações
          </h2>
          <p className="privacy-content">
            Explique como as informações são transferidas pela TravelConnect.
          </p>

          <h2 className="privacy-section">
            7. Como Respondemos a Solicitações Legais
          </h2>
          <p className="privacy-content">
            Acessamos, preservamos e compartilhamos suas informações em resposta
            a solicitações legais, cumprindo a legislação aplicável e prevenindo
            danos.
          </p>

          <h2 className="privacy-section">
            8. Como Você Será Notificado Sobre Alterações na Política
          </h2>
          <p className="privacy-content">
            Nós lhe enviaremos uma notificação antes de alterar esta Política.
            Você terá a oportunidade de ler a versão modificada antes de decidir
            continuar usando nossos Produtos.
          </p>

          <h2 className="privacy-section">
            9. Como Entrar em Contato Conosco em Caso de Dúvidas
          </h2>

          <p className="privacy-content">
            Se você tem dúvidas sobre esta Política ou perguntas, queixas ou
            solicitações relacionadas às suas informações, entre em contato
            conosco conforme descrito abaixo.
          </p>

          <p className="privacy-content">
            Você pode entrar em contato conosco por e-mail:
          </p>

          <p className="privacy-content">suport@travelconnect.com</p>

          <h2 className="privacy-section">Aviso de Privacidade do Brasil</h2>
          <p className="privacy-content">
            Esta seção se aplica a atividades de tratamento de dados pessoais de
            acordo com as leis brasileiras e complementa esta Política de
            Privacidade.
          </p>

          <p className="privacy-content">
            De acordo com a Lei Geral de Proteção de Dados Pessoais do Brasil
            (“LGPD”), você tem o direito de acessar, retificar e apagar seus
            dados, além de autorizar nosso tratamento deles e solicitar sua
            portabilidade. Saiba mais sobre os seus direitos e veja como você
            pode exercê-los. Em determinadas circunstâncias, você também tem o
            direito de contestar e restringir o tratamento dos seus dados
            pessoais ou de revogar seu consentimento que usamos como base para
            tratar dados fornecidos. Esta Política de Dados traz informações
            sobre como compartilhamos dados. Caso queira solicitar mais
            informações sobre as nossas práticas de dados.
          </p>

          <p className="privacy-content">
            O controlador de dados responsável por suas informações é a Travel
            Platforms, Inc. Você também tem o direito de contatar a Autoridade
            Nacional de Proteção de Dados (“ANPD”) entrando em contato
            diretamente com a DPA.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
