const popup = document.getElementById("feedbackPopup");
const popupBox = document.querySelector(".popup-box");
const feedbackBtn = document.getElementById("feedbackBtn");
const popupClose = document.getElementById("popupClose");

// 翻译词典
const i18n = {
  en: {
    surname: "Surname/Family name:",
    given: "Given name:",
    XUEFENG:"XUEFENG",
    LI:"LI",
    issuing: "Issuing Post Name:",
    entries: "Entries:",
    LA:"LOS ANGELES",
    BJ:"BEIJING",
    reel: "REEL",
    allProjects: "ALL PROJECT",
    focus: "Focus:",
    focus_graphic: "GRAPHIC DESIGN",
    focus_motion: "MOTION GRAPHIC DESIGN",
    focus_uiux: "UI/UX DESIGN",
    newProjects: "NEW projects!",
    tag_uiux: "{uiux}",
    tag_service: "{Service}",
    tag_XR:"{XR}",
    feedback_label: "Customs Feedback:",
    feedback_placeholder: "Let me know your favorite project...",
  },

  zh: {
    surname: "姓名：",
    LI:"李雪丰",
    given: "性别：",
    XUEFENG:"女/F",
    LA:"洛杉矶",
    BJ:"北京",
    issuing: "签发地点：",
    entries: "类型：",
    reel: "作品集视频",
    allProjects: "全部项目",
    focus: "签发机关：",
    focus_graphic: "平面设计",
    focus_motion: "动态图形设计",
    focus_uiux: "交互 / 界面设计",
    newProjects: "入境记录",
    tag_uiux: "{界面/交互}",
    tag_service: "{服务设计}",
    tag_XR:"{虚拟现实}",
    feedback_label: "海关留言：",
    feedback_placeholder: " 请确认该设计师是否通行！",    
  }

};

// 切换函数
function switchLang(lang) {
  $("[data-i18n]").each(function () {
    const key = $(this).data("i18n");
    
    if ($(this).is("input, textarea")) {
      $(this).attr("placeholder", i18n[lang][key]);
    } else {
      $(this).text(i18n[lang][key]);
    }
  });
}

// dropdown 切换触发
$(".dropdown").on("change", function () {
  if ($(this).val() === "bj") {
    switchLang("zh");
    $("html").attr("lang", "zh-CN");
  } else {
    switchLang("en");
    $("html").attr("lang", "en");
  }
});

// 页面加载时先设置为英文
switchLang("en");

//  打开弹窗

feedbackBtn.onclick = () => {
  popup.style.display = "flex";

  popupBox.style.animation = "popupFadeScaleIn 0.25s cubic-bezier(0.25,1,0.5,1) forwards";
};

// 关闭弹窗
function closePopup() {
  popupBox.style.animation = "popupFadeScaleOut 0.25s cubic-bezier(0.25,1,0.5,1) forwards";

  // 动画结束后隐藏
  setTimeout(() => {
    popup.style.display = "none";
  }, 250);
}

popupClose.onclick = closePopup;

// 点击遮罩关闭
popup.onclick = (e) => {
  if (e.target === popup) {
    closePopup();
  }
};

//EmailJS
$(function () {
  $("#contact-form").on("submit", function (e) {
    e.preventDefault();

    const name = $("#user-name").val();
    const email = $("#user-email").val();
    const message = $("#message").val();

    $("#send-btn").text("Sending... ✉️");

    emailjs.send("service_fk8bkba", "template_jnd48mh", {
      to_name: "Xuefeng Li",
      from_name: name,
      reply_to: email,
      message: message,
    })
    .then(function () {
      $("#send-btn").text("Sent ✔️");
      $("#user-name").val("");
      $("#user-email").val("");
      $("#message").val("");

      // 1.5 秒后自动关闭弹窗
      setTimeout(() => {
        $("#feedbackPopup").css("display", "none");
        $("#send-btn").text("SEND");
      }, 1500);
    })
    .catch(function () {
      $("#send-btn").text("Error ❌");
    });
  });
});


//play video in Project page
// 自动播放可见的视频（可选，如果希望视频自动播放）
$("video").each(function() {
  this.play().catch(() => {});
});



//导航页面选中

$(function() {
  $(".tab").on("click", function() {
    const clickedCategory = $(this).data("category");

    // 如果点击的是 "all"
    if (clickedCategory === "all") {
      $(".tab").removeClass("active");         // 清除其他分类
      $(this).addClass("active");              // 只选中 all
      $(".Project_cover").fadeIn(300);         // 显示所有视频
      return;
    }

    // 点击其他分类时
    $(this).toggleClass("active");              // 切换当前分类
    $(".tab[data-category='all']").removeClass("active"); // 取消 all 的选中

    // 获取所有选中的分类
    const activeCategories = $(".tab.active").map(function() {
      return $(this).data("category");
    }).get();

    // 没有选中任何分类 → 回到 all 状态
    if (activeCategories.length === 0) {
      $(".tab[data-category='all']").addClass("active");
      $(".Project_cover").fadeIn(300);
      return;
    }

    // 根据选中的分类显示视频
    $(".Project_cover").each(function() {
      const videoCategory = $(this).data("category");
      if (activeCategories.includes(videoCategory)) {
        $(this).fadeIn(300);
      } else {
        $(this).fadeOut(200);
      }
    });
  });
});

const params = new URLSearchParams(window.location.search);
const defaultCategory = params.get("category");

$(function () {
  if (defaultCategory) {
    const targetTab = $(`.tab[data-category="${defaultCategory}"]`);
    if (targetTab.length) {
      targetTab.trigger("click");  // ✅ 自动触发 click，自然套用筛选逻辑
    }
  }
});
