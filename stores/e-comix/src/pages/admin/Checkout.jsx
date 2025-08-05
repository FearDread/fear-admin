import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BannerSub from "../../components/Banner/BannerSub";
import { store } from "../../features/store";

const Checkout = () => {
  
  return (
    <>
      <BannerSub />
      <main className="float-start w-100 total-body home-body mt-0">
        <section className="checkout-page-main-div my-5">

          <div className="container">
            <div className="form-wizard">
              <form action="https://oxentictemplates.in/templatemonster/comicstore/hj" method="post" role="form">
                <div className="form-wizard-header">

                  <ul className="list-unstyled form-wizard-steps clearfix d-none">
                    <li className="active">
                      <small className="d-block mb-3"> Checkout </small>
                      <span>1</span>
                    </li>
                    <li>
                      <small className="d-block mb-3"> Finished </small>
                      <span>4</span>
                    </li>

                  </ul>

                </div>
                <fieldset className="wizard-fieldset show">
                  <div className="row g-lg-5">

                    <div className="col-lg-8 checkout-left-div">
                      <div className="ad-fm ">
                        <div className="comon-steps-div">
                          <h2 className="page-haeding m-0"> Billing Address </h2>
                          <div className="row mt-4">
                            <div className="col-lg-12">
                              <div className="form-group">
                                <label> Full Name </label>
                                <input type="text" className="form-control wizard-required" />
                                <div className="wizard-form-error"></div>

                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label>Select Country</label>
                                <select id='country_select' name='country' className="form-select">
                                  <option value="AF">Afghanistan</option>
                                  <option value="AX">Åland Islands</option>
                                  <option value="AL">Albania</option>
                                  <option value="DZ">Algeria</option>
                                  <option value="AS">American Samoa</option>
                                  <option value="AD">Andorra</option>
                                  <option value="AO">Angola</option>
                                  <option value="AI">Anguilla</option>
                                  <option value="AQ">Antarctica</option>
                                  <option value="AG">Antigua and Barbuda</option>
                                  <option value="AR">Argentina</option>
                                  <option value="AM">Armenia</option>
                                  <option value="AW">Aruba</option>
                                  <option value="AU">Australia</option>
                                  <option value="AT">Austria</option>
                                  <option value="AZ">Azerbaijan</option>
                                  <option value="BS">Bahamas</option>
                                  <option value="BH">Bahrain</option>
                                  <option value="BD">Bangladesh</option>
                                  <option value="BB">Barbados</option>
                                  <option value="BY">Belarus</option>
                                  <option value="BE">Belgium</option>
                                  <option value="BZ">Belize</option>
                                  <option value="BJ">Benin</option>
                                  <option value="BM">Bermuda</option>
                                  <option value="BT">Bhutan</option>
                                  <option value="BO">Bolivia, Plurinational State of</option>
                                  <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                                  <option value="BA">Bosnia and Herzegovina</option>
                                  <option value="BW">Botswana</option>
                                  <option value="BV">Bouvet Island</option>
                                  <option value="BR">Brazil</option>
                                  <option value="IO">British Indian Ocean Territory</option>
                                  <option value="BN">Brunei Darussalam</option>
                                  <option value="BG">Bulgaria</option>
                                  <option value="BF">Burkina Faso</option>
                                  <option value="BI">Burundi</option>
                                  <option value="KH">Cambodia</option>
                                  <option value="CM">Cameroon</option>
                                  <option value="CA">Canada</option>
                                  <option value="CV">Cape Verde</option>
                                  <option value="KY">Cayman Islands</option>
                                  <option value="CF">Central African Republic</option>
                                  <option value="TD">Chad</option>
                                  <option value="CL">Chile</option>
                                  <option value="CN">China</option>
                                  <option value="CX">Christmas Island</option>
                                  <option value="CC">Cocos (Keeling) Islands</option>
                                  <option value="CO">Colombia</option>
                                  <option value="KM">Comoros</option>
                                  <option value="CG">Congo</option>
                                  <option value="CD">Congo, the Democratic Republic of the</option>
                                  <option value="CK">Cook Islands</option>
                                  <option value="CR">Costa Rica</option>
                                  <option value="CI">Côte d'Ivoire</option>
                                  <option value="HR">Croatia</option>
                                  <option value="CU">Cuba</option>
                                  <option value="CW">Curaçao</option>
                                  <option value="CY">Cyprus</option>
                                  <option value="CZ">Czech Republic</option>
                                  <option value="DK">Denmark</option>
                                  <option value="DJ">Djibouti</option>
                                  <option value="DM">Dominica</option>
                                  <option value="DO">Dominican Republic</option>
                                  <option value="EC">Ecuador</option>
                                  <option value="EG">Egypt</option>
                                  <option value="SV">El Salvador</option>
                                  <option value="GQ">Equatorial Guinea</option>
                                  <option value="ER">Eritrea</option>
                                  <option value="EE">Estonia</option>
                                  <option value="ET">Ethiopia</option>
                                  <option value="FK">Falkland Islands (Malvinas)</option>
                                  <option value="FO">Faroe Islands</option>
                                  <option value="FJ">Fiji</option>
                                  <option value="FI">Finland</option>
                                  <option value="FR">France</option>
                                  <option value="GF">French Guiana</option>
                                  <option value="PF">French Polynesia</option>
                                  <option value="TF">French Southern Territories</option>
                                  <option value="GA">Gabon</option>
                                  <option value="GM">Gambia</option>
                                  <option value="GE">Georgia</option>
                                  <option value="DE">Germany</option>
                                  <option value="GH">Ghana</option>
                                  <option value="GI">Gibraltar</option>
                                  <option value="GR">Greece</option>
                                  <option value="GL">Greenland</option>
                                  <option value="GD">Grenada</option>
                                  <option value="GP">Guadeloupe</option>
                                  <option value="GU">Guam</option>
                                  <option value="GT">Guatemala</option>
                                  <option value="GG">Guernsey</option>
                                  <option value="GN">Guinea</option>
                                  <option value="GW">Guinea-Bissau</option>
                                  <option value="GY">Guyana</option>
                                  <option value="HT">Haiti</option>
                                  <option value="HM">Heard Island and McDonald Islands</option>
                                  <option value="VA">Holy See (Vatican City State)</option>
                                  <option value="HN">Honduras</option>
                                  <option value="HK">Hong Kong</option>
                                  <option value="HU">Hungary</option>
                                  <option value="IS">Iceland</option>
                                  <option value="IN">India</option>
                                  <option value="ID">Indonesia</option>
                                  <option value="IR">Iran, Islamic Republic of</option>
                                  <option value="IQ">Iraq</option>
                                  <option value="IE">Ireland</option>
                                  <option value="IM">Isle of Man</option>
                                  <option value="IL">Israel</option>
                                  <option value="IT">Italy</option>
                                  <option value="JM">Jamaica</option>
                                  <option value="JP">Japan</option>
                                  <option value="JE">Jersey</option>
                                  <option value="JO">Jordan</option>
                                  <option value="KZ">Kazakhstan</option>
                                  <option value="KE">Kenya</option>
                                  <option value="KI">Kiribati</option>
                                  <option value="KP">Korea, Democratic People's Republic of</option>
                                  <option value="KR">Korea, Republic of</option>
                                  <option value="KW">Kuwait</option>
                                  <option value="KG">Kyrgyzstan</option>
                                  <option value="LA">Lao People's Democratic Republic</option>
                                  <option value="LV">Latvia</option>
                                  <option value="LB">Lebanon</option>
                                  <option value="LS">Lesotho</option>
                                  <option value="LR">Liberia</option>
                                  <option value="LY">Libya</option>
                                  <option value="LI">Liechtenstein</option>
                                  <option value="LT">Lithuania</option>
                                  <option value="LU">Luxembourg</option>
                                  <option value="MO">Macao</option>
                                  <option value="MK">Macedonia, the former Yugoslav Republic of</option>
                                  <option value="MG">Madagascar</option>
                                  <option value="MW">Malawi</option>
                                  <option value="MY">Malaysia</option>
                                  <option value="MV">Maldives</option>
                                  <option value="ML">Mali</option>
                                  <option value="MT">Malta</option>
                                  <option value="MH">Marshall Islands</option>
                                  <option value="MQ">Martinique</option>
                                  <option value="MR">Mauritania</option>
                                  <option value="MU">Mauritius</option>
                                  <option value="YT">Mayotte</option>
                                  <option value="MX">Mexico</option>
                                  <option value="FM">Micronesia, Federated States of</option>
                                  <option value="MD">Moldova, Republic of</option>
                                  <option value="MC">Monaco</option>
                                  <option value="MN">Mongolia</option>
                                  <option value="ME">Montenegro</option>
                                  <option value="MS">Montserrat</option>
                                  <option value="MA">Morocco</option>
                                  <option value="MZ">Mozambique</option>
                                  <option value="MM">Myanmar</option>
                                  <option value="NA">Namibia</option>
                                  <option value="NR">Nauru</option>
                                  <option value="NP">Nepal</option>
                                  <option value="NL">Netherlands</option>
                                  <option value="NC">New Caledonia</option>
                                  <option value="NZ">New Zealand</option>
                                  <option value="NI">Nicaragua</option>
                                  <option value="NE">Niger</option>
                                  <option value="NG">Nigeria</option>
                                  <option value="NU">Niue</option>
                                  <option value="NF">Norfolk Island</option>
                                  <option value="MP">Northern Mariana Islands</option>
                                  <option value="NO">Norway</option>
                                  <option value="OM">Oman</option>
                                  <option value="PK">Pakistan</option>
                                  <option value="PW">Palau</option>
                                  <option value="PS">Palestinian Territory, Occupied</option>
                                  <option value="PA">Panama</option>
                                  <option value="PG">Papua New Guinea</option>
                                  <option value="PY">Paraguay</option>
                                  <option value="PE">Peru</option>
                                  <option value="PH">Philippines</option>
                                  <option value="PN">Pitcairn</option>
                                  <option value="PL">Poland</option>
                                  <option value="PT">Portugal</option>
                                  <option value="PR">Puerto Rico</option>
                                  <option value="QA">Qatar</option>
                                  <option value="RE">Réunion</option>
                                  <option value="RO">Romania</option>
                                  <option value="RU">Russian Federation</option>
                                  <option value="RW">Rwanda</option>
                                  <option value="BL">Saint Barthélemy</option>
                                  <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                                  <option value="KN">Saint Kitts and Nevis</option>
                                  <option value="LC">Saint Lucia</option>
                                  <option value="MF">Saint Martin (French part)</option>
                                  <option value="PM">Saint Pierre and Miquelon</option>
                                  <option value="VC">Saint Vincent and the Grenadines</option>
                                  <option value="WS">Samoa</option>
                                  <option value="SM">San Marino</option>
                                  <option value="ST">Sao Tome and Principe</option>
                                  <option value="SA">Saudi Arabia</option>
                                  <option value="SN">Senegal</option>
                                  <option value="RS">Serbia</option>
                                  <option value="SC">Seychelles</option>
                                  <option value="SL">Sierra Leone</option>
                                  <option value="SG">Singapore</option>
                                  <option value="SX">Sint Maarten (Dutch part)</option>
                                  <option value="SK">Slovakia</option>
                                  <option value="SI">Slovenia</option>
                                  <option value="SB">Solomon Islands</option>
                                  <option value="SO">Somalia</option>
                                  <option value="ZA">South Africa</option>
                                  <option value="GS">South Georgia and the South Sandwich Islands</option>
                                  <option value="SS">South Sudan</option>
                                  <option value="ES">Spain</option>
                                  <option value="LK">Sri Lanka</option>
                                  <option value="SD">Sudan</option>
                                  <option value="SR">Suriname</option>
                                  <option value="SJ">Svalbard and Jan Mayen</option>
                                  <option value="SZ">Swaziland</option>
                                  <option value="SE">Sweden</option>
                                  <option value="CH">Switzerland</option>
                                  <option value="SY">Syrian Arab Republic</option>
                                  <option value="TW">Taiwan, Province of China</option>
                                  <option value="TJ">Tajikistan</option>
                                  <option value="TZ">Tanzania, United Republic of</option>
                                  <option value="TH">Thailand</option>
                                  <option value="TL">Timor-Leste</option>
                                  <option value="TG">Togo</option>
                                  <option value="TK">Tokelau</option>
                                  <option value="TO">Tonga</option>
                                  <option value="TT">Trinidad and Tobago</option>
                                  <option value="TN">Tunisia</option>
                                  <option value="TR">Turkey</option>
                                  <option value="TM">Turkmenistan</option>
                                  <option value="TC">Turks and Caicos Islands</option>
                                  <option value="TV">Tuvalu</option>
                                  <option value="UG">Uganda</option>
                                  <option value="UA">Ukraine</option>
                                  <option value="AE">United Arab Emirates</option>
                                  <option value="GB">United Kingdom</option>
                                  <option value="US">United States</option>
                                  <option value="UM">United States Minor Outlying Islands</option>
                                  <option value="UY">Uruguay</option>
                                  <option value="UZ">Uzbekistan</option>
                                  <option value="VU">Vanuatu</option>
                                  <option value="VE">Venezuela, Bolivarian Republic of</option>
                                  <option value="VN">Viet Nam</option>
                                  <option value="VG">Virgin Islands, British</option>
                                  <option value="VI">Virgin Islands, U.S.</option>
                                  <option value="WF">Wallis and Futuna</option>
                                  <option value="EH">Western Sahara</option>
                                  <option value="YE">Yemen</option>
                                  <option value="ZM">Zambia</option>
                                  <option value="ZW">Zimbabwe</option>
                                </select>

                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label>State / Country  </label>
                                <select className="form-select">
                                  <option selected>select State</option>
                                  <option value="1">Option 1</option>
                                  <option value="2">Option 2</option>
                                  <option value="3">Option 3</option>
                                </select>
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label> Town / City  </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label> Postal Code  / Zipcode  </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label> House Number </label>
                                <input type="text" className="form-control wizard-required" />
                                <div className="wizard-form-error"></div>

                              </div>
                            </div>


                            <div className="col-lg-6">
                              <div className="form-group">
                                <label> Phone </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="form-group">
                                <label> Address 1 </label>
                                <input type="text" className="form-control wizard-required" />
                                <div className="wizard-form-error"></div>

                              </div>
                            </div>


                          </div>
                        </div>
                        <div className="form-check mt-3">
                          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                          <label className="form-check-label" for="flexCheckDefault">
                            If Address same Please Check
                          </label>
                        </div>
                        <div className="comon-steps-div mt-5">
                          <h2 className="page-haeding m-0"> Shipping Address </h2>
                          <div className="row mt-3">
                            <div className="col-lg-12">
                              <div className="form-group">
                                <label> Full Name </label>
                                <input type="text" className="form-control wizard-required" />
                                <div className="wizard-form-error"></div>

                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label>Select Country</label>
                                <select id='scountry_select' name='country' className="form-select">
                                  <option value="AF">Afghanistan</option>
                                  <option value="AX">Åland Islands</option>
                                  <option value="AL">Albania</option>
                                  <option value="DZ">Algeria</option>
                                  <option value="AS">American Samoa</option>
                                  <option value="AD">Andorra</option>
                                  <option value="AO">Angola</option>
                                  <option value="AI">Anguilla</option>
                                  <option value="AQ">Antarctica</option>
                                  <option value="AG">Antigua and Barbuda</option>
                                  <option value="AR">Argentina</option>
                                  <option value="AM">Armenia</option>
                                  <option value="AW">Aruba</option>
                                  <option value="AU">Australia</option>
                                  <option value="AT">Austria</option>
                                  <option value="AZ">Azerbaijan</option>
                                  <option value="BS">Bahamas</option>
                                  <option value="BH">Bahrain</option>
                                  <option value="BD">Bangladesh</option>
                                  <option value="BB">Barbados</option>
                                  <option value="BY">Belarus</option>
                                  <option value="BE">Belgium</option>
                                  <option value="BZ">Belize</option>
                                  <option value="BJ">Benin</option>
                                  <option value="BM">Bermuda</option>
                                  <option value="BT">Bhutan</option>
                                  <option value="BO">Bolivia, Plurinational State of</option>
                                  <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                                  <option value="BA">Bosnia and Herzegovina</option>
                                  <option value="BW">Botswana</option>
                                  <option value="BV">Bouvet Island</option>
                                  <option value="BR">Brazil</option>
                                  <option value="IO">British Indian Ocean Territory</option>
                                  <option value="BN">Brunei Darussalam</option>
                                  <option value="BG">Bulgaria</option>
                                  <option value="BF">Burkina Faso</option>
                                  <option value="BI">Burundi</option>
                                  <option value="KH">Cambodia</option>
                                  <option value="CM">Cameroon</option>
                                  <option value="CA">Canada</option>
                                  <option value="CV">Cape Verde</option>
                                  <option value="KY">Cayman Islands</option>
                                  <option value="CF">Central African Republic</option>
                                  <option value="TD">Chad</option>
                                  <option value="CL">Chile</option>
                                  <option value="CN">China</option>
                                  <option value="CX">Christmas Island</option>
                                  <option value="CC">Cocos (Keeling) Islands</option>
                                  <option value="CO">Colombia</option>
                                  <option value="KM">Comoros</option>
                                  <option value="CG">Congo</option>
                                  <option value="CD">Congo, the Democratic Republic of the</option>
                                  <option value="CK">Cook Islands</option>
                                  <option value="CR">Costa Rica</option>
                                  <option value="CI">Côte d'Ivoire</option>
                                  <option value="HR">Croatia</option>
                                  <option value="CU">Cuba</option>
                                  <option value="CW">Curaçao</option>
                                  <option value="CY">Cyprus</option>
                                  <option value="CZ">Czech Republic</option>
                                  <option value="DK">Denmark</option>
                                  <option value="DJ">Djibouti</option>
                                  <option value="DM">Dominica</option>
                                  <option value="DO">Dominican Republic</option>
                                  <option value="EC">Ecuador</option>
                                  <option value="EG">Egypt</option>
                                  <option value="SV">El Salvador</option>
                                  <option value="GQ">Equatorial Guinea</option>
                                  <option value="ER">Eritrea</option>
                                  <option value="EE">Estonia</option>
                                  <option value="ET">Ethiopia</option>
                                  <option value="FK">Falkland Islands (Malvinas)</option>
                                  <option value="FO">Faroe Islands</option>
                                  <option value="FJ">Fiji</option>
                                  <option value="FI">Finland</option>
                                  <option value="FR">France</option>
                                  <option value="GF">French Guiana</option>
                                  <option value="PF">French Polynesia</option>
                                  <option value="TF">French Southern Territories</option>
                                  <option value="GA">Gabon</option>
                                  <option value="GM">Gambia</option>
                                  <option value="GE">Georgia</option>
                                  <option value="DE">Germany</option>
                                  <option value="GH">Ghana</option>
                                  <option value="GI">Gibraltar</option>
                                  <option value="GR">Greece</option>
                                  <option value="GL">Greenland</option>
                                  <option value="GD">Grenada</option>
                                  <option value="GP">Guadeloupe</option>
                                  <option value="GU">Guam</option>
                                  <option value="GT">Guatemala</option>
                                  <option value="GG">Guernsey</option>
                                  <option value="GN">Guinea</option>
                                  <option value="GW">Guinea-Bissau</option>
                                  <option value="GY">Guyana</option>
                                  <option value="HT">Haiti</option>
                                  <option value="HM">Heard Island and McDonald Islands</option>
                                  <option value="VA">Holy See (Vatican City State)</option>
                                  <option value="HN">Honduras</option>
                                  <option value="HK">Hong Kong</option>
                                  <option value="HU">Hungary</option>
                                  <option value="IS">Iceland</option>
                                  <option value="IN">India</option>
                                  <option value="ID">Indonesia</option>
                                  <option value="IR">Iran, Islamic Republic of</option>
                                  <option value="IQ">Iraq</option>
                                  <option value="IE">Ireland</option>
                                  <option value="IM">Isle of Man</option>
                                  <option value="IL">Israel</option>
                                  <option value="IT">Italy</option>
                                  <option value="JM">Jamaica</option>
                                  <option value="JP">Japan</option>
                                  <option value="JE">Jersey</option>
                                  <option value="JO">Jordan</option>
                                  <option value="KZ">Kazakhstan</option>
                                  <option value="KE">Kenya</option>
                                  <option value="KI">Kiribati</option>
                                  <option value="KP">Korea, Democratic People's Republic of</option>
                                  <option value="KR">Korea, Republic of</option>
                                  <option value="KW">Kuwait</option>
                                  <option value="KG">Kyrgyzstan</option>
                                  <option value="LA">Lao People's Democratic Republic</option>
                                  <option value="LV">Latvia</option>
                                  <option value="LB">Lebanon</option>
                                  <option value="LS">Lesotho</option>
                                  <option value="LR">Liberia</option>
                                  <option value="LY">Libya</option>
                                  <option value="LI">Liechtenstein</option>
                                  <option value="LT">Lithuania</option>
                                  <option value="LU">Luxembourg</option>
                                  <option value="MO">Macao</option>
                                  <option value="MK">Macedonia, the former Yugoslav Republic of</option>
                                  <option value="MG">Madagascar</option>
                                  <option value="MW">Malawi</option>
                                  <option value="MY">Malaysia</option>
                                  <option value="MV">Maldives</option>
                                  <option value="ML">Mali</option>
                                  <option value="MT">Malta</option>
                                  <option value="MH">Marshall Islands</option>
                                  <option value="MQ">Martinique</option>
                                  <option value="MR">Mauritania</option>
                                  <option value="MU">Mauritius</option>
                                  <option value="YT">Mayotte</option>
                                  <option value="MX">Mexico</option>
                                  <option value="FM">Micronesia, Federated States of</option>
                                  <option value="MD">Moldova, Republic of</option>
                                  <option value="MC">Monaco</option>
                                  <option value="MN">Mongolia</option>
                                  <option value="ME">Montenegro</option>
                                  <option value="MS">Montserrat</option>
                                  <option value="MA">Morocco</option>
                                  <option value="MZ">Mozambique</option>
                                  <option value="MM">Myanmar</option>
                                  <option value="NA">Namibia</option>
                                  <option value="NR">Nauru</option>
                                  <option value="NP">Nepal</option>
                                  <option value="NL">Netherlands</option>
                                  <option value="NC">New Caledonia</option>
                                  <option value="NZ">New Zealand</option>
                                  <option value="NI">Nicaragua</option>
                                  <option value="NE">Niger</option>
                                  <option value="NG">Nigeria</option>
                                  <option value="NU">Niue</option>
                                  <option value="NF">Norfolk Island</option>
                                  <option value="MP">Northern Mariana Islands</option>
                                  <option value="NO">Norway</option>
                                  <option value="OM">Oman</option>
                                  <option value="PK">Pakistan</option>
                                  <option value="PW">Palau</option>
                                  <option value="PS">Palestinian Territory, Occupied</option>
                                  <option value="PA">Panama</option>
                                  <option value="PG">Papua New Guinea</option>
                                  <option value="PY">Paraguay</option>
                                  <option value="PE">Peru</option>
                                  <option value="PH">Philippines</option>
                                  <option value="PN">Pitcairn</option>
                                  <option value="PL">Poland</option>
                                  <option value="PT">Portugal</option>
                                  <option value="PR">Puerto Rico</option>
                                  <option value="QA">Qatar</option>
                                  <option value="RE">Réunion</option>
                                  <option value="RO">Romania</option>
                                  <option value="RU">Russian Federation</option>
                                  <option value="RW">Rwanda</option>
                                  <option value="BL">Saint Barthélemy</option>
                                  <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                                  <option value="KN">Saint Kitts and Nevis</option>
                                  <option value="LC">Saint Lucia</option>
                                  <option value="MF">Saint Martin (French part)</option>
                                  <option value="PM">Saint Pierre and Miquelon</option>
                                  <option value="VC">Saint Vincent and the Grenadines</option>
                                  <option value="WS">Samoa</option>
                                  <option value="SM">San Marino</option>
                                  <option value="ST">Sao Tome and Principe</option>
                                  <option value="SA">Saudi Arabia</option>
                                  <option value="SN">Senegal</option>
                                  <option value="RS">Serbia</option>
                                  <option value="SC">Seychelles</option>
                                  <option value="SL">Sierra Leone</option>
                                  <option value="SG">Singapore</option>
                                  <option value="SX">Sint Maarten (Dutch part)</option>
                                  <option value="SK">Slovakia</option>
                                  <option value="SI">Slovenia</option>
                                  <option value="SB">Solomon Islands</option>
                                  <option value="SO">Somalia</option>
                                  <option value="ZA">South Africa</option>
                                  <option value="GS">South Georgia and the South Sandwich Islands</option>
                                  <option value="SS">South Sudan</option>
                                  <option value="ES">Spain</option>
                                  <option value="LK">Sri Lanka</option>
                                  <option value="SD">Sudan</option>
                                  <option value="SR">Suriname</option>
                                  <option value="SJ">Svalbard and Jan Mayen</option>
                                  <option value="SZ">Swaziland</option>
                                  <option value="SE">Sweden</option>
                                  <option value="CH">Switzerland</option>
                                  <option value="SY">Syrian Arab Republic</option>
                                  <option value="TW">Taiwan, Province of China</option>
                                  <option value="TJ">Tajikistan</option>
                                  <option value="TZ">Tanzania, United Republic of</option>
                                  <option value="TH">Thailand</option>
                                  <option value="TL">Timor-Leste</option>
                                  <option value="TG">Togo</option>
                                  <option value="TK">Tokelau</option>
                                  <option value="TO">Tonga</option>
                                  <option value="TT">Trinidad and Tobago</option>
                                  <option value="TN">Tunisia</option>
                                  <option value="TR">Turkey</option>
                                  <option value="TM">Turkmenistan</option>
                                  <option value="TC">Turks and Caicos Islands</option>
                                  <option value="TV">Tuvalu</option>
                                  <option value="UG">Uganda</option>
                                  <option value="UA">Ukraine</option>
                                  <option value="AE">United Arab Emirates</option>
                                  <option value="GB">United Kingdom</option>
                                  <option value="US">United States</option>
                                  <option value="UM">United States Minor Outlying Islands</option>
                                  <option value="UY">Uruguay</option>
                                  <option value="UZ">Uzbekistan</option>
                                  <option value="VU">Vanuatu</option>
                                  <option value="VE">Venezuela, Bolivarian Republic of</option>
                                  <option value="VN">Viet Nam</option>
                                  <option value="VG">Virgin Islands, British</option>
                                  <option value="VI">Virgin Islands, U.S.</option>
                                  <option value="WF">Wallis and Futuna</option>
                                  <option value="EH">Western Sahara</option>
                                  <option value="YE">Yemen</option>
                                  <option value="ZM">Zambia</option>
                                  <option value="ZW">Zimbabwe</option>
                                </select>

                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label>State / Country  </label>
                                <select className="form-select">
                                  <option selected>select State</option>
                                  <option value="1">Option 1</option>
                                  <option value="2">Option 2</option>
                                  <option value="3">Option 3</option>
                                </select>
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label> Town / City  </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label> Postal Code  / Zipcode  </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label> House Number </label>
                                <input type="text" className="form-control wizard-required" />
                                <div className="wizard-form-error"></div>

                              </div>
                            </div>


                            <div className="col-lg-6">
                              <div className="form-group">
                                <label> Phone </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="form-group">
                                <label> Address 1 </label>
                                <input type="text" className="form-control wizard-required" />
                                <div className="wizard-form-error"></div>

                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="paymeny comon-steps-div mt-5">

                          <h2 className="page-haeding m-0"> Payment method  </h2>
                          <div className="d-flex align-items-center justify-content-between mt-4">
                            <div className="custom-control custom-radio ">
                              <input type="radio" id="customRadio1" name="customRadio" className="custom-control-input" checked />
                              <label className="custom-control-label" for="customRadio1">Credit Crads /
                                Debit Card </label>
                            </div>
                            <figure className="m-0">
                              <img src="images/visag01.jpg" alt="bnm" />
                            </figure>
                          </div>


                          <div className="account-page-n" id="ac-1">


                            <div className="row row-cols-1 row-cols-lg-1">
                              <div className="col">
                                <div className="form-group mt-3">
                                  <label> Cardholder Name </label>
                                  <input type="text" className="form-control" />
                                </div>
                              </div>
                              <div className="col">
                                <div className="form-group mt-3">
                                  <label> Card Number </label>
                                  <input type="text" className="form-control" />
                                </div>
                              </div>
                            </div>


                            <div className="d-flex mt-3">

                              <div className="left-sec-d1">
                                <h4> End Date </h4>
                                <div className="end-date">
                                  <select className="form-select">
                                    <option selected>MM</option>
                                    <option value="1">Option 1</option>
                                    <option value="2">Option 2</option>
                                    <option value="3">Option 3</option>
                                  </select>

                                  <select className="form-select">
                                    <option selected>YYYY</option>
                                    <option value="1">Option 1</option>
                                    <option value="2">Option 2</option>
                                    <option value="3">Option 3</option>
                                  </select>
                                </div>
                              </div>

                              <div className="left-sec-d2">
                                <h4> CVV</h4>
                                <div className="cvv">
                                  <input type="text" className="form-control" />
                                  <span> <i className="fas fa-exclamation-circle"></i> 3 digits</span>
                                </div>
                              </div>
                            </div>

                          </div>

                          <div className="custom-control custom-radio mt-3">
                            <input type="radio" id="customRadio2" name="customRadio" className="custom-control-input" />
                            <label className="custom-control-label" for="customRadio2">Online Banking</label>
                          </div>

                          <div className="account-page-n" id="ac-2">

                            <div className="form-group">
                              <label> Select Bank </label>
                              <select className="form-select">
                                <option selected>This is a select menu</option>
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4 checkout-right-div">
                      <div className="ceck-out-right-div new-checkout mt-5 mt-lg-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <h2 className="page-haeding m-0"> Your Order </h2>
                        </div>
                        <div className="oder-summary-item mt-4">
                          <table className="table checkout-table">
                            <thead>
                              <tr>
                                <th scope="col"> Product </th>
                                <th scope="col">Quantity</th>
                                <th scope="col">amount</th>

                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  Shoes
                                </td>
                                <td>x 1</td>
                                <td>$15</td>

                              </tr>
                              <tr>
                                <td>T-shirt</td>
                                <td>x 1</td>
                                <td>$15</td>

                              </tr>

                            </tbody>
                          </table>
                        </div>

                        <div className="oder-right-details-new">

                          <div className="price-sec-order">
                            <p className="price-am"> Price <span> $150 </span></p>
                            <p className="delivery-am"> Delivery charges <span> Free </span></p>
                            <p className="discount-am"> Discount price <span> $ 10 </span></p>
                            <div className="total-price p-0">
                              <p className="discount-am mb-lg-0"> Total Amount <span> $ 220 </span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a href="checkout.html#" className="comon-button btn text-center mt-5">
                        <span> Payment now </span>
                      </a>

                    </div>

                  </div>
                  <div className="form-group d-lg-flex clearfix">
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Checkout;