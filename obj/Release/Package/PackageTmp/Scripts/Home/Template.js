class Template {

  constructor() { }

  static Menu(idUsuario) {
    let loader = `<div class="loader loader-menu loader-white"></div>`;
    let menuContainer = document.querySelector('.menu-container');
    menuContainer.innerHTML = loader;    
    let path = `${document.querySelector('#BuscaTelaURL').value}?id=${idUsuario}`;
    this.Get(path)
      .then(res => {
        menuContainer.innerHTML = "";
        let menuString = "";
        res.Result.forEach(x => {
          menuString += `<li class="nav-link"><a href="/${x.tel_Controller}/${x.tel_Metodo}">${x.tel_Descricao}</a></li>`;
        });
        menuContainer.innerHTML += menuString;
      })
      .catch(err => console.log(res));
  }

  static Get(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(xhr.responseText);
          }
        }
      };
      xhr.send();
    }
    );
  }

  static GetUnparsed(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(xhr.responseText);
          } else if (xhr.status == 404) {
            reject(xhr.responseText);
          } else {
            reject(xhr.responseText);
          }
        }
      };
      xhr.send();
    }
    );
  }

  static ChangePassword() {
    let modalChangePassword = `
      <div class="modal fade" id="ModalAlterarSenha" tabindex="-1" role="dialog" aria-labelledby="ModalLabelAlterarSenha" aria-hidden="true">
          <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content" style="background: #ffffff; border-radius: 15px; border: 2px solid #000;">
                  <div class="modal-header">
                      <h4 class="example-title" id="ModalLabelAlterarSenha">Alterar senha</h4>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body content-loader">
                      <div class="row">
                        <div class="col-lg-12">
                          <div>
                            <p>Nova Senha:</p>
                            <input type="password" id="novaSenhaUsuario" class="text" style="width: 100%;" />
                          </div>
                          <div>
                            <p>Confirmação de senha:</p>
                            <input type="password" id="confirmaSenha" class="text" style="width: 100%;"/>
                          </div>
                        </div>
                      </div>
                      <div class="row" style="margin-top: 1.5em;">
                        <div class="col-lg-12">
                          <input type="button" id="AlterarSenha" class="input form-control btn btn-success" placeholder="Altar a Senha" value="Alterar Senha" onclick="ResetSenhaUsuario();" />
                        </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                  </div>
              </div>
          </div>
      </div>
    `;
    document.querySelector('.modal-container').innerHTML += modalChangePassword;
  }

  static Close() {
    setTimeout(function Redirect() { document.location.assign($("#LogoutUsuarioURL").val()) }, 3000);
  }

  static ImgUser() {
    let src = localStorage.getItem('imgPerfil');
    let imgContainer = document.querySelector('.user-info-image');
    if (src.length > 0) {
      this.GetUnparsed(src)
        .then(r => {
          imgContainer.src = `${src}`;
        })
        .catch(e => {
          imgContainer.src = `/Images/user.png`;
        });
    } else {
      imgContainer.src = `/Images/user.png`;
    }
  }
  
}