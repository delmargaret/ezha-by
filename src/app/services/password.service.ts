import { Injectable } from '@angular/core';
import { lib, blockList, personalData } from '../../misc/library';
import { AbstractControl } from '@angular/forms';

const StrengthLevel = {
  none: 0,
  weak: 1,
  medium: 2,
  strong: 3,
  best: 4,
};

@Injectable()
export class PasswordService {
  info: string | null;

  constructor() {
    this.info = null;
  }

  checkPassword(
    passwordStr: string,
    password: AbstractControl | null,
    skipEmpty: boolean = false
  ): number {
    const passwordLength = passwordStr.length;

    if (passwordLength == 0) {
      if (skipEmpty) {
        this.info = null;
        this.setValid();
        return StrengthLevel.best;
      }

      this.info = 'Пароль: никакой. Пароль пустой.';
      password?.markAsDirty();
      this.setInvalid();
      return StrengthLevel.none;
    }

    if (passwordLength < 10) {
      this.info =
        'Пароль: слабый. Длина пароля должна быть больше либо равна 10.';
      password?.markAsDirty();
      this.setInvalid();
      return StrengthLevel.weak;
    }

    const existsInLibrary = this.existsInLibrary(passwordStr);
    const containsUpperCase = this.containsUpperCase(passwordStr);
    const containsLowerCase = this.containsLowerCase(passwordStr);
    const containsNumbers = this.containsNumbers(passwordStr);
    const containsSymbols = this.containsSymbols(passwordStr);
    const containsCharacterSequence =
      this.containsCharacterSequence(passwordStr);
    const containsBlockedPasswords = this.containsBlockedPasswords(passwordStr);
    const containsPersonalData = this.containsPersonalData(passwordStr);
    const containsSimilarWords = this.containsSimilarWords(passwordStr);

    let symbolTypeCount = 0;
    symbolTypeCount += containsUpperCase ? 1 : 0;
    symbolTypeCount += containsLowerCase ? 1 : 0;
    symbolTypeCount += containsNumbers ? 1 : 0;
    symbolTypeCount += containsSymbols ? 1 : 0;

    if (containsBlockedPasswords || containsPersonalData) {
      this.info =
        'Пароль: слабый. Пароль содержит известные слова, пароли или персональные данные.';
      password?.markAsDirty();
      this.setInvalid();
      return StrengthLevel.weak;
    }

    if (symbolTypeCount < 2) {
      this.info =
        'Пароль: слабый. Пароль должен содержать нижний/верхний регистры, символы или цифры (минимум две из этих четырех групп).';
      password?.markAsDirty();
      this.setInvalid();
      return StrengthLevel.weak;
    }

    if (symbolTypeCount == 2) {
      this.info =
        'Пароль: средний. Пароль должен содержать нижний/верхний регистры, символы или цифры (только две из этих четырех групп использованы).';
      this.setInvalid();
      return StrengthLevel.medium;
    }

    if (existsInLibrary || containsCharacterSequence) {
      this.info =
        'Пароль: средний. Пароль содержит известные слова или последовательность символов.';
      this.setInvalid();
      return StrengthLevel.medium;
    }

    if (passwordLength < 14) {
      this.info =
        'Пароль: стойкий. Длина пароля должна быть минимум 14 символов чтобы пароль был сильнее.';
      this.setValid();
      return StrengthLevel.strong;
    }

    if (containsSimilarWords) {
      this.info =
        'Пароль: стойкий. Пароль содержит слова схожие с известными словами.';
      this.setValid();
      return StrengthLevel.strong;
    }

    this.info = 'Пароль: отличный.';
    this.setValid();
    return StrengthLevel.best;
  }

  existsInLibrary(word: string) {
    if (lib.some((w) => word.toLowerCase().includes(w))) {
      return true;
    }
    return false;
  }

  containsUpperCase(word: string) {
    return /[A-Z]/.test(word);
  }

  containsLowerCase(word: string) {
    return /[a-z]/.test(word);
  }

  containsNumbers(word: string) {
    return /[0-9]/.test(word);
  }

  containsSymbols(word: string) {
    return /[-!$@#%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(word);
  }

  containsCharacterSequence(word: string) {
    return /(.)\1{3}/.test(word);
  }

  containsBlockedPasswords(word: string) {
    if (blockList.some((w) => word.toLowerCase().includes(w))) {
      return true;
    }
    return false;
  }

  containsPersonalData(word: string) {
    return (
      /([0-9]){6}/.test(word) ||
      /([0-9]){8}/.test(word) ||
      /([0-9]){2}.([0-9]){2}.([0-9]){2}/.test(word) ||
      /([0-9]){2}.([0-9]){2}.([0-9]){4}/.test(word) ||
      /([0-9]){2}-([0-9]){2}-([0-9]){2}/.test(word) ||
      /([0-9]){2}-([0-9]){2}-([0-9]){4}/.test(word) ||
      /([0-9]){2}\/([0-9]){2}\/([0-9]){2}/.test(word) ||
      /([0-9]){2}\/([0-9]){2}\/([0-9]){4}/.test(word) ||
      personalData.some((w) => word.toLowerCase().includes(w))
    );
  }

  containsSimilarWords(word: string) {
    var similarChars: any = {
      '3': 'e',
      x: 'k',
      '5': 's',
      $: 's',
      '6': 'g',
      '7': 't',
      '8': 'b',
      '|': 'l',
      '9': 'g',
      '+': 't',
      '@': 'a',
      '0': 'o',
      '1': 'l',
      '2': 'z',
      '!': 'i',
    };

    Object.keys(similarChars).forEach((key) => {
      word = word.split(key).join(similarChars[key]);
    });
    return (
      this.existsInLibrary(word) ||
      this.containsBlockedPasswords(word) ||
      this.containsPersonalData(word)
    );
  }

  setInvalid() {
    var a = document.getElementById('passwordInput');
    if (a) {
      var x = a.className;
      a.className = x + ' ng-invalid';
    }
  }

  setValid() {
    var a = document.getElementById('passwordInput');
    if (a) {
      var x = a.className;
      a.className = x.split(' ng-invalid').join('');
    }
  }
}
